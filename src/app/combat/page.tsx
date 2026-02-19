"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCombatStore } from "@/stores/combat-store";
import { isActionResponse } from "@/lib/claude/action-parser";
import { isSpeechRecognitionSupported, createSpeechRecognition } from "@/lib/voice/speech-recognition";
import { speakNarration, stopNarration } from "@/lib/voice/speech-synthesis";
import { RewardsScreen } from "@/components/combat/rewards-screen";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Swords } from "lucide-react";
import { PageShell, fadeUp } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import type { VoiceState } from "@/lib/voice/speech-recognition";
import type { ClaudeResponse, ActiveStatusEffect } from "@/types/combat";

export default function CombatTrackerPage() {
  const {
    status, encounterName, roundNumber, participants, initiativeOrder,
    currentTurnIndex, actionLog,
    advanceTurn, applyDamage, applyHealing, applyStatusEffect,
    removeEffect, tickParticipantEffects, useSpellSlot,
    setDefending, markAbilityUsed, addLogEntry, abandonCombat, endCombat, enterRewardsPhase, resetCombat,
  } = useCombatStore();

  const router = useRouter();
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [typedInput, setTypedInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [lastNarration, setLastNarration] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  // Tracks transcript synchronously so onerror/onEnd callbacks can read it
  const transcriptRefCapture = useRef("");

  const currentActorId = initiativeOrder[currentTurnIndex];
  const currentActor = participants.find((p) => p.id === currentActorId);

  const heroesAlive = participants.filter((p) => p.team === 'hero' && p.isActive).length;
  const enemiesAlive = participants.filter((p) => p.team === 'enemy' && p.isActive).length;

  const processAction = useCallback(async (text: string) => {
    if (!text.trim() || processing) return;
    setProcessing(true);
    setVoiceState('processing');

    const MAX_CLIENT_RETRIES = 1; // 1 retry = 2 total attempts
    let succeeded = false;

    for (let clientAttempt = 0; clientAttempt <= MAX_CLIENT_RETRIES; clientAttempt++) {
      try {
        // 12s client timeout — stays above Vercel's 10s + network overhead
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch('/api/combat/action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.NEXT_PUBLIC_APP_KEY && { 'X-App-Key': process.env.NEXT_PUBLIC_APP_KEY }),
          },
          body: JSON.stringify({
            transcript: text,
            combatState: { roundNumber, participants, initiativeOrder, currentTurnIndex },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        // Always try to parse JSON
        let data: ClaudeResponse;
        try {
          data = await res.json();
        } catch {
          if (clientAttempt < MAX_CLIENT_RETRIES) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          setLastNarration("Connection issue. Check your Wi-Fi and try again.");
          setVoiceState('error');
          break;
        }

        if (!res.ok) {
          // On 502 (server exhausted retries), try once more from client
          if (res.status === 502 && clientAttempt < MAX_CLIENT_RETRIES) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          if (res.status === 429) {
            setLastNarration("Too many requests! Wait a few seconds and try again.");
          } else {
            const errData = data as { clarificationNeeded?: string; error?: string };
            setLastNarration(errData.clarificationNeeded ?? errData.error ?? "Something went wrong. Try again.");
          }
          setVoiceState('clarification');
          break;
        }

        if (isActionResponse(data)) {
          // Apply results
          for (const result of data.results) {
            if (result.hpChange < 0) applyDamage(result.participantId, Math.abs(result.hpChange));
            if (result.hpChange > 0) applyHealing(result.participantId, result.hpChange);
            for (const effect of result.newEffects) {
              applyStatusEffect(result.participantId, {
                ...effect,
                id: crypto.randomUUID(),
                remainingTurns: (effect as unknown as { duration?: number | null }).duration ?? null,
              } as ActiveStatusEffect);
            }
            for (const effectId of result.removedEffects) {
              removeEffect(result.participantId, effectId);
            }
            if (result.slotsUsed > 0) {
              useSpellSlot(result.participantId, result.slotsUsed);
            }
          }

          // Apply top-level spell slot cost (if specified at action level)
          if (data.slotsUsed && data.slotsUsed > 0) {
            useSpellSlot(data.action.actorId, data.slotsUsed);
          }

          if (data.action.type === 'defend') {
            setDefending(data.action.actorId, true);
          }

          // Track one-time ability usage for monsters
          if (data.action.type === 'ability' && currentActor?.team === 'enemy') {
            const specialUsed = currentActor.specialAbilities?.find(
              sa => sa.name.toLowerCase() === data.action.name.toLowerCase() && sa.isOneTime
            );
            if (specialUsed) {
              markAbilityUsed(currentActorId, specialUsed.name);
            }
          }

          // Add log entry
          const targets = data.action.targetIds.map((tid) => {
            const p = participants.find((pp) => pp.id === tid);
            return { id: tid, name: p?.displayName ?? 'Unknown' };
          });
          addLogEntry({
            roundNumber,
            actorId: data.action.actorId,
            actorName: currentActor?.displayName ?? 'Unknown',
            actionType: data.action.type,
            abilityName: data.action.name,
            targets,
            roll: data.action.roll,
            targetNumber: data.action.targetNumber,
            success: data.action.hit,
            damage: data.results.reduce((s, r) => s + Math.max(0, -r.hpChange), 0) || undefined,
            healing: data.results.reduce((s, r) => s + Math.max(0, r.hpChange), 0) || undefined,
            narration: data.narration,
            narrationShort: data.narrationShort,
            voiceTranscript: text,
          });

          setLastNarration(data.narration);
          speakNarration(data.narration);
          setVoiceState('resolved');
          succeeded = true;

          // Auto-advance turn with dynamic delay based on narration length
          if (data.turnComplete) {
            const advanceDelay = Math.max(1500, data.narration.length * 30);
            setTimeout(() => {
              setDefending(currentActorId, false);
              const nextIdx = (currentTurnIndex + 1) % initiativeOrder.length;
              const nextId = initiativeOrder[nextIdx];
              setDefending(nextId, false);
              tickParticipantEffects(nextId);
              advanceTurn();
            }, advanceDelay);
          }
        } else {
          setLastNarration(data.clarificationNeeded);
          setVoiceState('clarification');
        }
        break; // Success or clarification — exit retry loop

      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          if (clientAttempt < MAX_CLIENT_RETRIES) continue;
          setLastNarration("That took too long. Try saying it more simply.");
          setVoiceState('error');
        } else {
          if (clientAttempt < MAX_CLIENT_RETRIES) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          setLastNarration("Something went wrong. Try again or type the action.");
          setVoiceState('error');
        }
      }
    }

    if (!succeeded && !['clarification', 'error'].includes(voiceState)) {
      setVoiceState('error');
    }
    setProcessing(false);
    setTranscript("");
    setTypedInput("");
  }, [processing, roundNumber, participants, initiativeOrder, currentTurnIndex, currentActor,
      currentActorId, applyDamage, applyHealing, applyStatusEffect, removeEffect, addLogEntry,
      useSpellSlot, setDefending, markAbilityUsed, tickParticipantEffects, advanceTurn]);

  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      return;
    }
    stopNarration();
    setVoiceState('listening');
    setTranscript("");
    transcriptRefCapture.current = "";

    const recognition = createSpeechRecognition({
      continuous: false,
      interimResults: true,
      onResult: (text, isFinal) => {
        transcriptRefCapture.current = text;
        setTranscript(text);
        if (isFinal) {
          setVoiceState('confirming');
        }
      },
      onError: () => {
        // If we already captured speech, go to confirm instead of dropping it
        if (transcriptRefCapture.current.trim()) {
          setVoiceState('confirming');
        } else {
          setVoiceState('error');
        }
      },
      onStart: () => {},
      onEnd: () => {
        // If recognition ended without a final result but we have interim text, confirm it
        if (transcriptRefCapture.current.trim()) {
          setVoiceState(prev => prev === 'listening' ? 'confirming' : prev);
        }
        if (recognitionRef.current) recognitionRef.current = null;
      },
    });

    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const confirmTranscript = () => {
    processAction(transcript);
  };

  const handleTypedSubmit = () => {
    processAction(typedInput);
  };

  // Rewards phase
  if (status === 'rewards') {
    return <RewardsScreen />;
  }

  // No active combat
  if (status !== 'active') {
    return (
      <PageShell>
        <PageHeader
          title="COMBAT"
          backHref="/"
          backLabel="Home"
          subtitle={status === 'completed' ? 'Completed' : 'No Active Encounter'}
        />
        <motion.div variants={fadeUp} className="flex-1 flex flex-col items-center justify-center gap-6 min-h-[50vh]">
          {status === 'completed' && (
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-gold mb-2">{heroesAlive > 0 ? 'Victory!' : 'Defeat...'}</p>
              <p className="text-text-muted">{encounterName}</p>
            </div>
          )}
          <div className="flex gap-4">
            <Button variant="game-lego-green" size="game-lg" asChild>
              <Link href="/combat/setup">
                <Swords className="w-5 h-5" />
                Set Up New Encounter
              </Link>
            </Button>
            {status === 'completed' && (
              <button onClick={resetCombat} className="rounded-xl bg-bg-input px-8 py-4 text-lg font-bold hover:bg-bg-input/80 transition-colors">
                Clear
              </button>
            )}
          </div>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <div className="h-screen p-4 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            <span className="text-accent-red font-mono">COMBAT</span>
            <span className="text-text-secondary ml-2">&mdash; {encounterName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">Round {roundNumber}</span>
          <button onClick={() => {
            setDefending(currentActorId, false);
            const nextIdx = (currentTurnIndex + 1) % initiativeOrder.length;
            const nextId = initiativeOrder[nextIdx];
            setDefending(nextId, false);
            tickParticipantEffects(nextId);
            advanceTurn();
          }} className="rounded-lg bg-bg-input px-3 py-1 text-xs text-text-secondary hover:text-white transition-colors">
            Skip Turn
          </button>
          <button onClick={enterRewardsPhase} className="rounded-lg bg-bg-input px-3 py-1 text-xs text-text-secondary hover:text-white transition-colors">
            End Combat
          </button>
          <button onClick={() => setShowLeaveDialog(true)} className="rounded-lg bg-bg-input px-3 py-1 text-xs text-red-400 hover:text-red-300 transition-colors">
            Leave Battle
          </button>
        </div>
      </div>

      {/* Main Layout: initiative + combatants + log */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Initiative Order */}
        <div className="col-span-2 space-y-1 overflow-y-auto">
          <h3 className="text-xs text-text-muted uppercase mb-2">Initiative</h3>
          {initiativeOrder.map((pid, idx) => {
            const p = participants.find((pp) => pp.id === pid);
            if (!p) return null;
            const isCurrent = idx === currentTurnIndex;
            return (
              <div key={pid} className={`rounded-lg px-3 py-2 text-xs transition-colors ${
                isCurrent ? 'bg-accent-red text-white' :
                !p.isActive ? 'bg-bg-input/30 text-text-dim line-through' :
                p.team === 'hero' ? 'bg-bg-card text-green-400' : 'bg-bg-card text-red-400'
              }`}>
                <div className="flex justify-between">
                  <span className="truncate">{p.displayName}</span>
                  <span className="text-text-muted">{p.initiativeRoll}</span>
                </div>
                {p.isActive && (
                  <div className="w-full h-1 bg-black/20 rounded-full mt-1">
                    <div className={`h-full rounded-full ${p.team === 'hero' ? 'bg-hp-high' : 'bg-hp-low'}`}
                      style={{ width: `${(p.currentHp / p.maxHp) * 100}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Combatant Cards */}
        <div className="col-span-7 space-y-3 overflow-y-auto">
          {/* Current Actor Banner */}
          {currentActor && (
            <div className={`rounded-xl p-4 border-2 ${currentActor.team === 'hero' ? 'border-green-500 bg-green-950/20' : 'border-red-500 bg-red-950/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-secondary uppercase">Current Turn</p>
                  <p className="text-lg font-bold">{currentActor.displayName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">HP: {currentActor.currentHp}/{currentActor.maxHp}</p>
                  {currentActor.spellSlotsMax > 0 && (
                    <p className="text-xs text-text-secondary">Slots: {currentActor.spellSlotsUsed}/{currentActor.spellSlotsMax} used</p>
                  )}
                </div>
              </div>
              {currentActor.statusEffects.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {currentActor.statusEffects.map((e) => (
                    <span key={e.id} className="text-xs bg-bg-input rounded px-2 py-0.5">{e.displayName} ({e.remainingTurns}t)</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Heroes Row */}
          <h3 className="text-xs text-text-muted uppercase">Heroes</h3>
          <div className="space-y-3">
            {participants.filter((p) => p.team === 'hero').map((p) => (
              <CombatantCard key={p.id} participant={p} isCurrent={p.id === currentActorId} />
            ))}
          </div>

          {/* Enemies Row */}
          <h3 className="text-xs text-text-muted uppercase">Enemies</h3>
          <div className="space-y-3">
            {participants.filter((p) => p.team === 'enemy').map((p) => (
              <CombatantCard key={p.id} participant={p} isCurrent={p.id === currentActorId} />
            ))}
          </div>
        </div>

        {/* Action Log */}
        <div className="col-span-3 flex flex-col min-h-0">
          <h3 className="shrink-0 text-xs text-text-muted uppercase mb-2">Action Log</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {[...actionLog].reverse().map((entry) => (
              <div key={entry.id} className="rounded-lg bg-bg-card p-3 text-xs">
                <p className="text-text-secondary">R{entry.roundNumber} &mdash; {entry.actorName}</p>
                <p className="font-medium">{entry.narrationShort || entry.abilityName || entry.actionType}</p>
                {entry.roll !== undefined && (
                  <p className="text-text-muted mt-1">
                    Roll: {entry.roll} vs {entry.targetNumber} &mdash; {entry.success ? <span className="text-green-400">Hit!</span> : <span className="text-red-400">Miss</span>}
                  </p>
                )}
              </div>
            ))}
            {actionLog.length === 0 && <p className="text-text-dim text-xs italic">No actions yet</p>}
          </div>
        </div>
      </div>

      {/* Narration Banner */}
      {lastNarration && (
        <div className="shrink-0 mt-3 rounded-lg bg-bg-card border border-border-card px-4 py-3 text-sm italic text-zinc-300 max-h-20 overflow-y-auto">
          {lastNarration}
        </div>
      )}

      {/* Voice Input Bar — sticky at bottom */}
      <div className="shrink-0 mt-3 rounded-xl bg-bg-card border border-border-card p-4 flex items-center gap-4">
        <button
          onClick={startListening}
          disabled={processing}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-colors ${
            voiceState === 'listening' ? 'bg-red-500 animate-pulse' :
            processing ? 'bg-zinc-700' : 'bg-accent-red hover:bg-accent-red/80'
          }`}
        >
          {voiceState === 'listening' ? '\u{1F534}' : '\u{1F3A4}'}
        </button>

        <div className="flex-1">
          {voiceState === 'listening' && (
            <p className="text-sm text-zinc-300">{transcript || "Listening..."}</p>
          )}
          {voiceState === 'confirming' && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-white flex-1">&quot;{transcript}&quot;</p>
              <button onClick={confirmTranscript} className="rounded-lg bg-green-600 px-3 py-1 text-xs font-bold hover:bg-green-700">Confirm</button>
              <button onClick={startListening} className="rounded-lg bg-bg-input px-3 py-1 text-xs text-text-secondary hover:text-white">Retry</button>
            </div>
          )}
          {voiceState === 'processing' && (
            <p className="text-sm text-text-secondary animate-pulse">Processing action...</p>
          )}
          {voiceState === 'resolved' && (
            <p className="text-sm text-green-400">Action resolved! Tap mic for next action.</p>
          )}
          {voiceState === 'clarification' && (
            <p className="text-sm text-yellow-400">{lastNarration}</p>
          )}
          {voiceState === 'error' && (
            <p className="text-sm text-red-400">Error. Try again or type instead.</p>
          )}
          {voiceState === 'idle' && (
            <form onSubmit={(e) => { e.preventDefault(); handleTypedSubmit(); }} className="flex gap-2">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder={`${currentActor?.displayName ?? 'Actor'}'s turn — tap mic or type an action`}
                className="flex-1 rounded-lg bg-bg-input px-3 py-2 text-sm text-white placeholder-text-muted"
              />
              <button type="submit" disabled={!typedInput.trim() || processing}
                className="rounded-lg bg-accent-red px-4 py-2 text-sm font-bold hover:bg-accent-red/80 disabled:opacity-40">
                Send
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Leave Battle Confirmation */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="bg-bg-card border-border-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-accent-gold">Leave Battle?</DialogTitle>
            <DialogDescription className="text-text-secondary">
              All combat progress will be lost. No rewards will be given. Characters will be restored to their pre-combat state.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setShowLeaveDialog(false)}
              className="rounded-lg bg-bg-input px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { abandonCombat(); router.push('/combat/setup'); }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
            >
              Leave Battle
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CombatantCard({ participant: p, isCurrent }: { participant: import("@/types/combat").CombatParticipant; isCurrent: boolean }) {
  const hpPct = (p.currentHp / p.maxHp) * 100;
  const slotsRemaining = p.spellSlotsMax - p.spellSlotsUsed;

  return (
    <div className={`rounded-xl bg-bg-card border p-3 transition-colors ${
      !p.isActive ? 'border-zinc-700 opacity-40' :
      isCurrent ? (p.team === 'hero' ? 'border-green-500 ring-1 ring-green-500/30' : 'border-red-500 ring-1 ring-red-500/30') : 'border-border-card'
    }`}>
      {/* Header: Name, badges, MOV, stats */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm ${!p.isActive ? 'line-through' : ''}`}>
            {p.displayName}
          </span>
          {p.isBoss && <span className="text-[10px] font-bold bg-accent-gold/20 text-accent-gold rounded px-1.5 py-0.5">BOSS</span>}
          {p.isMinion && <span className="text-[10px] font-bold bg-zinc-600/40 text-zinc-400 rounded px-1.5 py-0.5">MINION</span>}
          {!p.isActive && <span className="text-xs text-red-500 font-bold">KO</span>}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="text-blue-400">MOV {p.mov}</span>
          <span className="opacity-30">|</span>
          <span>STR {p.stats.str}</span>
          <span>SPD {p.stats.spd}</span>
          <span>TGH {p.stats.tgh}</span>
          <span>SMT {p.stats.smt}</span>
        </div>
      </div>

      {/* HP bar */}
      <div className="mb-1">
        <div className="flex justify-between text-xs text-text-secondary mb-0.5">
          <span>HP</span>
          <span>{p.currentHp}/{p.maxHp}</span>
        </div>
        <div className="w-full h-2 bg-bg-input rounded-full">
          <div className={`h-full rounded-full transition-all ${hpPct > 50 ? 'bg-hp-high' : hpPct > 25 ? 'bg-hp-mid' : 'bg-hp-low'}`}
            style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      {/* Spell slots bar */}
      {p.spellSlotsMax > 0 && (
        <div className="mb-1">
          <div className="flex justify-between text-xs text-text-secondary mb-0.5">
            <span>Spell Slots</span>
            <span>{slotsRemaining}/{p.spellSlotsMax} remaining</span>
          </div>
          <div className="w-full h-1.5 bg-bg-input rounded-full">
            <div className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${(slotsRemaining / p.spellSlotsMax) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Hero abilities */}
      {p.abilities && p.abilities.length > 0 && (
        <div className="mt-2 border-t border-white/5 pt-2">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Abilities</p>
          <div className="space-y-0.5">
            {p.abilities.map((ab) => {
              const canAfford = ab.slotCost === 0 || ab.slotCost <= slotsRemaining;
              return (
                <div key={ab.id} className={`flex items-center justify-between text-[11px] rounded px-1.5 py-0.5 ${
                  canAfford ? 'text-text-primary' : 'text-text-muted opacity-40'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium truncate">{ab.name}</span>
                    {ab.slotCost > 0 ? (
                      <span className={`shrink-0 text-[10px] ${canAfford ? 'text-blue-400' : 'text-text-dim'}`}>
                        {ab.slotCost} slot{ab.slotCost > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] text-text-dim">free</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted shrink-0 ml-2">
                    {ab.range && <span>{ab.range}</span>}
                    {ab.damage && <span className="text-red-400">{ab.damage}</span>}
                    {ab.effect && <span className="text-emerald-400">{ab.effect}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monster special abilities */}
      {p.specialAbilities && p.specialAbilities.length > 0 && (
        <div className="mt-2 border-t border-white/5 pt-2">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Specials</p>
          <div className="space-y-0.5">
            {p.specialAbilities.map((sa) => {
              const isUsed = sa.isOneTime && (p.usedAbilityNames ?? []).includes(sa.name);
              return (
                <div key={sa.name} className={`text-[11px] rounded px-1.5 py-0.5 ${
                  isUsed ? 'text-text-muted opacity-40 line-through' : 'text-text-primary'
                }`}>
                  <span className="font-medium">{sa.name}</span>
                  {sa.isOneTime && !isUsed && (
                    <span className="text-accent-gold text-[10px] ml-1 font-bold">1x</span>
                  )}
                  {isUsed && (
                    <span className="text-text-dim text-[10px] ml-1 no-underline">USED</span>
                  )}
                  <span className="text-text-muted ml-2">{sa.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status effects + defending + hero surge */}
      {(p.statusEffects.length > 0 || p.isDefending || p.heroSurgeAvailable) && (
        <div className="flex flex-wrap items-center gap-1 mt-2 border-t border-white/5 pt-2">
          {p.heroSurgeAvailable && (
            <Badge variant="buff" className="text-[10px]">SURGE READY</Badge>
          )}
          {p.statusEffects.map((e) => (
            <Badge key={e.id} variant={e.category as "buff" | "debuff" | "cc" | "dot" | "hot"} className="text-[10px]">
              {e.displayName}{e.remainingTurns !== null ? ` (${e.remainingTurns}t)` : ''}
            </Badge>
          ))}
          {p.isDefending && (
            <Badge variant="buff" className="text-[10px]">DEFENDING +4</Badge>
          )}
        </div>
      )}
    </div>
  );
}

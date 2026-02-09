"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { useCombatStore } from "@/stores/combat-store";
import { isActionResponse } from "@/lib/claude/action-parser";
import { isSpeechRecognitionSupported, createSpeechRecognition } from "@/lib/voice/speech-recognition";
import { speakNarration, stopNarration } from "@/lib/voice/speech-synthesis";
import { RewardsScreen } from "@/components/combat/rewards-screen";
import { Badge } from "@/components/ui/badge";
import type { VoiceState } from "@/lib/voice/speech-recognition";
import type { ClaudeResponse, ActiveStatusEffect } from "@/types/combat";

export default function CombatTrackerPage() {
  const {
    status, encounterName, roundNumber, participants, initiativeOrder,
    currentTurnIndex, actionLog,
    advanceTurn, applyDamage, applyHealing, applyStatusEffect,
    removeEffect, tickParticipantEffects, regenResource, setResource,
    setDefending, addLogEntry, endCombat, enterRewardsPhase, resetCombat,
  } = useCombatStore();

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState("");
  const [typedInput, setTypedInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [lastNarration, setLastNarration] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const currentActorId = initiativeOrder[currentTurnIndex];
  const currentActor = participants.find((p) => p.id === currentActorId);

  const heroesAlive = participants.filter((p) => p.team === 'hero' && p.isActive).length;
  const enemiesAlive = participants.filter((p) => p.team === 'enemy' && p.isActive).length;

  const processAction = useCallback(async (text: string) => {
    if (!text.trim() || processing) return;
    setProcessing(true);
    setVoiceState('processing');

    try {
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
      });
      const data: ClaudeResponse = await res.json();

      if (isActionResponse(data)) {
        // Apply results
        for (const result of data.results) {
          if (result.hpChange < 0) applyDamage(result.participantId, Math.abs(result.hpChange));
          if (result.hpChange > 0) applyHealing(result.participantId, result.hpChange);
          for (const effect of result.newEffects) {
            applyStatusEffect(result.participantId, {
              ...effect,
              id: crypto.randomUUID(),
              remainingTurns: (effect as ActiveStatusEffect & { duration?: number }).remainingTurns ?? null,
            } as ActiveStatusEffect);
          }
          for (const effectId of result.removedEffects) {
            removeEffect(result.participantId, effectId);
          }
          // Bug fix: apply resource cost / drain
          if (result.resourceChange !== 0) {
            const rp = participants.find((pp) => pp.id === result.participantId);
            if (rp) setResource(result.participantId, (rp.currentResource ?? 0) + result.resourceChange);
          }
        }

        // Bug fix: apply rage generated for knights on melee hits
        if (data.rageGenerated && currentActor?.resourceType === 'rage') {
          setResource(currentActorId, (currentActor.currentResource ?? 0) + data.rageGenerated);
        }

        // Bug fix: set defending flag when action is defend
        if (data.action.type === 'defend') {
          setDefending(data.action.actorId, true);
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

        // Auto-advance turn
        if (data.turnComplete) {
          setTimeout(() => {
            // Clear defending from current actor and prep next participant
            setDefending(currentActorId, false);
            const nextIdx = (currentTurnIndex + 1) % initiativeOrder.length;
            const nextId = initiativeOrder[nextIdx];
            setDefending(nextId, false);
            tickParticipantEffects(nextId);
            regenResource(nextId);
            advanceTurn();
          }, 2000);
        }
      } else {
        setLastNarration(data.clarificationNeeded);
        setVoiceState('clarification');
      }
    } catch {
      setLastNarration("Something went wrong. Try again or type the action.");
      setVoiceState('error');
    }

    setProcessing(false);
    setTranscript("");
    setTypedInput("");
  }, [processing, roundNumber, participants, initiativeOrder, currentTurnIndex, currentActor,
      currentActorId, applyDamage, applyHealing, applyStatusEffect, removeEffect, addLogEntry,
      setResource, setDefending, tickParticipantEffects, regenResource, advanceTurn]);

  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      return;
    }
    stopNarration();
    setVoiceState('listening');
    setTranscript("");

    const recognition = createSpeechRecognition({
      continuous: false,
      interimResults: true,
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setVoiceState('confirming');
        }
      },
      onError: () => {
        setVoiceState('error');
      },
      onStart: () => {},
      onEnd: () => {
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
      <div className="min-h-screen p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-secondary hover:text-white text-sm">&larr; Home</Link>
            <h1 className="text-xl font-bold">
              <span className="text-accent-red">COMBAT</span>
              <span className="text-text-secondary ml-2">&mdash; {status === 'completed' ? 'Completed' : 'No Active Encounter'}</span>
            </h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {status === 'completed' && (
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-gold mb-2">{heroesAlive > 0 ? 'Victory!' : 'Defeat...'}</p>
              <p className="text-text-muted">{encounterName}</p>
            </div>
          )}
          <div className="flex gap-4">
            <Link href="/combat/setup" className="rounded-xl bg-accent-red px-8 py-4 text-lg font-bold hover:bg-accent-red/80 transition-colors">
              Set Up New Encounter
            </Link>
            {status === 'completed' && (
              <button onClick={resetCombat} className="rounded-xl bg-bg-input px-8 py-4 text-lg font-bold hover:bg-bg-input/80 transition-colors">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            <span className="text-accent-red">COMBAT</span>
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
            regenResource(nextId);
            advanceTurn();
          }} className="rounded-lg bg-bg-input px-3 py-1 text-xs text-text-secondary hover:text-white transition-colors">
            Skip Turn
          </button>
          <button onClick={enterRewardsPhase} className="rounded-lg bg-bg-input px-3 py-1 text-xs text-text-secondary hover:text-white transition-colors">
            End Combat
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
                  {currentActor.resourceType && (
                    <p className="text-xs text-text-secondary capitalize">{currentActor.resourceType}: {currentActor.currentResource}/{currentActor.maxResource}</p>
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
          <div className="grid grid-cols-2 gap-3">
            {participants.filter((p) => p.team === 'hero').map((p) => (
              <CombatantCard key={p.id} participant={p} isCurrent={p.id === currentActorId} />
            ))}
          </div>

          {/* Enemies Row */}
          <h3 className="text-xs text-text-muted uppercase">Enemies</h3>
          <div className="grid grid-cols-2 gap-3">
            {participants.filter((p) => p.team === 'enemy').map((p) => (
              <CombatantCard key={p.id} participant={p} isCurrent={p.id === currentActorId} />
            ))}
          </div>
        </div>

        {/* Action Log */}
        <div className="col-span-3 overflow-y-auto">
          <h3 className="text-xs text-text-muted uppercase mb-2">Action Log</h3>
          <div className="space-y-2">
            {actionLog.slice(0, 20).map((entry) => (
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
        <div className="mt-3 rounded-lg bg-bg-card border border-border-card px-4 py-3 text-sm italic text-zinc-300">
          {lastNarration}
        </div>
      )}

      {/* Voice Input Bar */}
      <div className="mt-3 rounded-xl bg-bg-card border border-border-card p-4 flex items-center gap-4">
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
    </div>
  );
}

function CombatantCard({ participant: p, isCurrent }: { participant: import("@/types/combat").CombatParticipant; isCurrent: boolean }) {
  const hpPct = (p.currentHp / p.maxHp) * 100;
  return (
    <div className={`rounded-xl bg-bg-card border p-3 transition-colors ${
      !p.isActive ? 'border-zinc-700 opacity-50' :
      isCurrent ? (p.team === 'hero' ? 'border-green-500' : 'border-red-500') : 'border-border-card'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-semibold text-sm ${!p.isActive ? 'line-through' : ''}`}>
          {p.displayName}
          {p.isBoss && <span className="text-accent-gold ml-1 text-xs">BOSS</span>}
        </span>
        {!p.isActive && <span className="text-xs text-red-500">KO</span>}
      </div>
      <div className="mb-1">
        <div className="flex justify-between text-xs text-text-secondary mb-0.5"><span>HP</span><span>{p.currentHp}/{p.maxHp}</span></div>
        <div className="w-full h-2 bg-bg-input rounded-full">
          <div className={`h-full rounded-full transition-all ${hpPct > 50 ? 'bg-hp-high' : hpPct > 25 ? 'bg-hp-mid' : 'bg-hp-low'}`}
            style={{ width: `${hpPct}%` }} />
        </div>
      </div>
      {p.resourceType && p.maxResource && (
        <div className="mb-1">
          <div className="flex justify-between text-xs text-text-secondary mb-0.5">
            <span className="capitalize">{p.resourceType}</span><span>{p.currentResource}/{p.maxResource}</span>
          </div>
          <div className="w-full h-1.5 bg-bg-input rounded-full">
            <div className={`h-full rounded-full ${p.resourceType === 'rage' ? 'bg-red-500' : p.resourceType === 'energy' ? 'bg-yellow-400' : 'bg-blue-500'}`}
              style={{ width: `${(p.currentResource / p.maxResource) * 100}%` }} />
          </div>
        </div>
      )}
      {p.statusEffects.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {p.statusEffects.map((e) => (
            <Badge key={e.id} variant={e.category as "buff" | "debuff" | "cc" | "dot" | "hot"} className="text-[10px]">
              {e.displayName}{e.remainingTurns !== null ? ` (${e.remainingTurns}t)` : ''}
            </Badge>
          ))}
        </div>
      )}
      {p.isDefending && <span className="text-[10px] text-blue-400 mt-1 block">DEFENDING +4</span>}
    </div>
  );
}

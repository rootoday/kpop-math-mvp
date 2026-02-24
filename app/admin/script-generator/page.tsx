'use client'

import { useState } from 'react'
import { useScriptQuestionGenerator } from '@/lib/hooks/useScriptQuestionGenerator'
import type { ScriptGeneratedQuestion } from '@/types/ai'

const DIFFICULTY_LABELS = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard']

const SAMPLE_SCRIPTS = [
  {
    label: 'NewJeans — Quadratic Equations',
    hook: "Wait NewJeans' OMG choreo has quadratic equations hidden in it?? 🤯",
    body: "When NewJeans performs their mirror choreography, they're actually showing us the axis of symmetry — that's the center line of a parabola! Watch how Minji and Haerin move in perfect parabola arcs during the chorus. If we plot their positions, we get y = -2x² + 8x + 3. The vertex (highest point of the jump) is at x = -b/2a = -8/(2×-2) = 2. That means at x=2, y = -2(4) + 16 + 3 = 11. The axis of symmetry is x = 2. This is exactly what the quadratic formula helps us find!",
    cta: "Let's ace math just like NewJeans~ Go follow now on my profile!",
  },
  {
    label: 'Stray Kids — Basic Probability',
    hook: 'Wait pulling your Stray Kids photocard is harder than winning lottery?',
    body: "Let's calculate the ACTUAL probability of pulling your bias photocard. Each Stray Kids album has 8 members × 2 versions = 16 possible photocards. The probability of getting your specific bias is 1/16 = 6.25%. If you buy 3 albums, the probability of getting your bias at least once is 1 - (15/16)³ = 1 - 0.824 = 17.6%. Even with 10 albums: 1 - (15/16)¹⁰ = 47.4% — still less than a coin flip! That's the power of independent probability events.",
    cta: 'I made a bias photocard probability calculator!',
  },
  {
    label: 'Seventeen — Percentages',
    hook: "Guess what percentage of Seventeen's music show wins had all members?",
    body: "Seventeen has won 85 music show trophies total. Out of those, 68 performances had all 13 members present. So the percentage is 68/85 × 100 = 80%. But here's where it gets interesting: in their first 2 years, only 15 out of 22 wins (68.2%) had full attendance. In their last 3 years? 53 out of 63 wins (84.1%). That's a 15.9 percentage POINT increase — showing how the group's commitment grew over time!",
    cta: 'Learning math through Seventeen hits different',
  },
]

export default function ScriptGeneratorPage() {
  const [hook, setHook] = useState('')
  const [body, setBody] = useState('')
  const [cta, setCta] = useState('')
  const [questionCount, setQuestionCount] = useState(3)
  const [difficulty, setDifficulty] = useState(3)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const {
    loading,
    error,
    analysis,
    questions,
    isSuccess,
    generateFromScript,
    reset,
  } = useScriptQuestionGenerator()

  const handleGenerate = () => {
    generateFromScript({
      script: { hook, body, cta },
      questionCount,
      difficulty,
    })
  }

  const handleLoadSample = (sample: typeof SAMPLE_SCRIPTS[number]) => {
    setHook(sample.hook)
    setBody(sample.body)
    setCta(sample.cta)
    reset()
  }

  const handleReset = () => {
    setHook('')
    setBody('')
    setCta('')
    reset()
  }

  const handleCopyJson = (question: ScriptGeneratedQuestion, index: number, tier: 'tier3' | 'tier4') => {
    const key = `${index}-${tier}`
    const data = tier === 'tier3' ? question.tier3 : question.tier4
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopiedIndex(key)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const hasScript = hook.trim().length > 0 || body.trim().length > 0

  return (
    <div className="animate-fade-in max-w-5xl">
      <div className="mb-8">
        <h2 className="text-3xl font-heading">Script → AI Questions</h2>
        <p className="text-gray-500 mt-2">
          Paste a viral video script (Hook + Body + CTA) and AI will auto-generate
          math questions for Tier 3 and Tier 4.
        </p>
      </div>

      {/* Sample Scripts */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Load Sample Script
        </label>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCRIPTS.map((sample) => (
            <button
              key={sample.label}
              onClick={() => handleLoadSample(sample)}
              disabled={loading}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-kpop-purple/5 hover:border-kpop-purple/30 transition-all disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Script Input */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-kpop border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Video Script
            </h3>

            {/* Hook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hook EN
                <span className="text-gray-400 font-normal ml-1">(attention grabber)</span>
              </label>
              <textarea
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder={'e.g. "Wait NewJeans\' OMG choreo has quadratic equations hidden in it??"'}
                disabled={loading}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpop-purple/40 focus:border-kpop-purple transition-all text-sm resize-none"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Body EN
                <span className="text-gray-400 font-normal ml-1">(math explanation)</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="The main content explaining the math concept through K-pop context..."
                disabled={loading}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpop-purple/40 focus:border-kpop-purple transition-all text-sm resize-none"
              />
            </div>

            {/* CTA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                CTA EN
                <span className="text-gray-400 font-normal ml-1">(call to action)</span>
              </label>
              <textarea
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder={'e.g. "Let\'s ace math just like NewJeans~ Go follow now on my profile!"'}
                disabled={loading}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpop-purple/40 focus:border-kpop-purple transition-all text-sm resize-none"
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Questions: <span className="text-kpop-purple font-bold">{questionCount}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  disabled={loading}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kpop-purple"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Difficulty: <span className="text-kpop-purple font-bold">{DIFFICULTY_LABELS[difficulty]}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  disabled={loading}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kpop-purple"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleGenerate}
                disabled={loading || !hasScript}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Script...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Questions
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {/* Analysis Card */}
          {analysis && (
            <div className="bg-white rounded-xl shadow-kpop border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gradient-to-r from-kpop-purple/10 to-transparent border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Script Analysis
                </h3>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Artist</span>
                  <p className="text-sm font-bold text-gray-800">{analysis.detectedArtist}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Math Concept</span>
                  <p className="text-sm font-bold text-gray-800">{analysis.detectedMathConcept}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Topic</span>
                  <p className="text-sm font-bold text-gray-800">{analysis.detectedTopic}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Summary</span>
                  <p className="text-sm text-gray-600">{analysis.scriptSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Questions */}
          {questions.map((q, i) => (
            <div key={i} className="bg-white rounded-xl shadow-kpop border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gradient-to-r from-music-green/10 to-transparent border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">
                  Question {i + 1} of {questions.length}
                </h3>
              </div>
              <div className="p-5 space-y-5">
                {/* Tier 3: Multiple Choice */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-kpop-purple uppercase flex items-center gap-1">
                      <span className="w-5 h-5 bg-kpop-purple text-white rounded-md flex items-center justify-center text-[10px] font-bold">T3</span>
                      Multiple Choice
                    </span>
                    <button
                      onClick={() => handleCopyJson(q, i, 'tier3')}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                    >
                      {copiedIndex === `${i}-tier3` ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy JSON
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-800">{q.tier3.questionText}</p>
                  <div className="space-y-1.5">
                    {q.tier3.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`text-sm px-3 py-2 rounded-lg border ${
                          opt.isCorrect
                            ? 'bg-green-50 border-green-300 text-green-800 font-medium'
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="font-bold mr-2">{opt.id.toUpperCase()}.</span>
                        {opt.text}
                        {opt.isCorrect && (
                          <span className="ml-2 text-green-600 text-xs">(Correct)</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
                    <span className="font-bold">Hint:</span> {q.tier3.hint}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Tier 4: Fill in Blank */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-kpop-red uppercase flex items-center gap-1">
                      <span className="w-5 h-5 bg-kpop-red text-white rounded-md flex items-center justify-center text-[10px] font-bold">T4</span>
                      Fill in the Blank
                    </span>
                    <button
                      onClick={() => handleCopyJson(q, i, 'tier4')}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                    >
                      {copiedIndex === `${i}-tier4` ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy JSON
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-800">{q.tier4.questionText}</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="text-xs font-bold text-green-700">Answer:</span>
                    <span className="text-sm font-bold text-green-800 ml-2">{q.tier4.correctAnswer}</span>
                  </div>
                  {q.tier4.acceptableAnswers.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Also accepts: {q.tier4.acceptableAnswers.join(', ')}
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
                    <span className="font-bold">Hint:</span> {q.tier4.hint}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!isSuccess && !error && !loading && (
            <div className="bg-white rounded-xl shadow-kpop border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-kpop-purple/10 to-kpop-red/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Paste a Video Script
              </h3>
              <p className="text-xs text-gray-500 max-w-[260px]">
                Enter your Hook, Body, and CTA from the content pipeline spreadsheet. AI will analyze the math content and generate quiz questions.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="bg-white rounded-xl shadow-kpop border border-gray-100 p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-kpop-purple/30 border-t-kpop-purple rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-600 font-medium">Analyzing script & generating questions...</p>
              <p className="text-xs text-gray-400 mt-1">Claude is reading your video script</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

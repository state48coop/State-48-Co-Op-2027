"use client";

import { useState } from "react";

const steps = ["Project Type", "Dimensions", "Materials", "Assets"];

export default function IntakePage() {
  const [step, setStep] = useState(0);
  return <main className="mx-auto max-w-3xl px-5 py-16"><p className="eyebrow">Project Intake</p><h1 className="display mt-4">Let’s start<br /><span className="text-ember">the build.</span></h1><div className="mt-10 flex gap-2">{steps.map((label, index) => <div className={`h-1 flex-1 ${index <= step ? "bg-ember" : "bg-black/10"}`} key={label} />)}</div><div className="panel mt-8 min-h-72 p-7"><p className="text-xs font-bold uppercase tracking-widest text-ember">Step {step + 1} of {steps.length}</p><h2 className="mt-4 text-3xl font-black uppercase">{steps[step]}</h2><p className="mt-3 text-black/60">This guided form will collect the information needed to scope your project clearly.</p>{step === 3 && <div className="mt-8 rounded border border-dashed border-black/20 p-10 text-center text-sm text-black/50">Drop CAD files, reference images, or sketches here.</div>}<div className="mt-10 flex justify-between"><button className="text-sm font-bold uppercase tracking-wider disabled:opacity-30" disabled={step === 0} onClick={() => setStep(value => value - 1)}>Back</button><button className="rounded-full bg-ember px-5 py-3 text-sm font-bold uppercase tracking-wider text-white" onClick={() => setStep(value => Math.min(value + 1, steps.length - 1))}>{step === steps.length - 1 ? "Submit Intake" : "Continue"}</button></div></div></main>;
}

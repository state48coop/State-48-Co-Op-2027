import Link from "next/link";

export default function GalleryPage() {
  return <main className="mx-auto max-w-7xl px-5 py-16"><p className="eyebrow">The Build Gallery</p><h1 className="display mt-4">Custom work,<br /><span className="text-ember">fully documented.</span></h1><div className="mt-10 grid gap-5 md:grid-cols-3">{["Commercial Fabrication", "Event Activations", "Heritage Furniture"].map((category, index) => <Link href={`/gallery/project-${index + 1}`} key={category} className="panel min-h-72 p-6"><span className="text-xs font-bold uppercase tracking-widest text-ember">0{index + 1}</span><h2 className="mt-40 text-2xl font-black uppercase">{category}</h2></Link>)}</div></main>;
}

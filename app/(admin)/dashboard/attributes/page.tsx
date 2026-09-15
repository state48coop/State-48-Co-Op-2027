import { AttributeBuilder } from "@/components/admin/attribute-builder";

export default function AttributesPage() {
  return <div className="mx-auto max-w-5xl px-5 py-12"><p className="eyebrow">Store Manager / Global Attributes</p><h1 className="display mt-4">Build the<br /><span className="text-ember">option tree.</span></h1><div className="panel mt-10 p-7"><AttributeBuilder /></div></div>;
}

import AppShell from "@/components/AppShell";
import IdeaForm from "@/components/IdeaForm";

export default function NewPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Start your Preflight Check
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Paste the product idea you&apos;re about to build. Preflight will help you find the
            assumptions behind it before you start shipping.
          </p>
        </div>
        <IdeaForm />
      </div>
    </AppShell>
  );
}

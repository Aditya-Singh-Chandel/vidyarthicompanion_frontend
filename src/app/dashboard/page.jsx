import OverrideWidget from "@/features/overrideEngine/OverrideWidget";
import ExpenseWidget from "@/features/pocketBuddy/ExpenseWidget";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        CampusFlow Dashboard
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left column: Action Center */}
        <section aria-labelledby="action-center-heading">
          <h2
            id="action-center-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
          >
            Action Center
          </h2>
          <OverrideWidget />
        </section>

        {/* Right column: Financial & Wellness */}
        <section aria-labelledby="financial-wellness-heading">
          <h2
            id="financial-wellness-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
          >
            Financial & Wellness
          </h2>
          <ExpenseWidget />
        </section>
      </div>
    </main>
  );
}

export default function LinksPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-transparent font-sans dark:bg-black">
      <main className="w-full max-w-3xl py-12 px-16">
        <h1 className="text-3xl font-bold zen-title mb-4">正派網站連結</h1>

        <div className="space-y-4 mt-10">
          <div className="flex items-center gap-2">
            <div className="text-lg font-medium">維基百科</div>
            <a href="https://zh.wikipedia.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline whitespace-nowrap">https://zh.wikipedia.org/</a>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-lg font-medium">程式題庫</div>
            <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline whitespace-nowrap">https://leetcode.com/</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-medium">Our World In Data</div>
            <a href="https://ourworldindata.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline whitespace-nowrap">https://ourworldindata.org/</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-medium">World Population Review</div>
            <a href="https://worldpopulationreview.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline whitespace-nowrap">https://worldpopulationreview.com/</a>
          </div>
        </div>
      </main>
    </div>
  );
}

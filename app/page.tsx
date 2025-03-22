import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      {/* ヘッダー */}
      <header className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Memo App</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/memos"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              メモ一覧
            </Link>
            <Link
              href="/users"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              ユーザー管理
            </Link>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="pt-16">
        {/* ヒーローセクション */}
        <section className="py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
              シンプルで使いやすい
              <br />
              マークダウンメモアプリ
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              あなたのアイデアを、すっきりと整理。
              <br />
              マークダウン形式で書けるシンプルなメモアプリで、
              <br />
              効率的な情報管理を実現します。
            </p>
            <Link
              href="/memos"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              メモを作成する →
            </Link>
          </div>
        </section>

        {/* 機能紹介セクション */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
              主な機能
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 機能1 */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  マークダウン対応
                </h4>
                <p className="text-gray-600">
                  シンプルな記法で、見やすい文書を作成できます。
                </p>
              </div>

              {/* 機能2 */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  リアルタイムプレビュー
                </h4>
                <p className="text-gray-600">
                  編集中の文書をリアルタイムでプレビューできます。
                </p>
              </div>

              {/* 機能3 */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  シンプルな管理
                </h4>
                <p className="text-gray-600">
                  直感的なインターフェースで、メモの管理が簡単です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p>© 2025 Memo App. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

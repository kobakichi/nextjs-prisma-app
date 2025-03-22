"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import remarkGfm from "remark-gfm";

type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// ヘッダーコンポーネント
const Header = () => (
  <header className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-10">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Memo App
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/memos"
          className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
);

// メモカードコンポーネント
const MemoCard = ({
  memo,
  onEdit,
  onDelete,
  isDeleting,
}: {
  memo: Memo;
  onEdit: (memo: Memo) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{memo.title}</h3>
      <div className="prose prose-sm max-h-32 overflow-hidden text-gray-600 mb-4">
        <ReactMarkdown>{memo.content.slice(0, 150) + "..."}</ReactMarkdown>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {new Date(memo.updatedAt).toLocaleString()}
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm text-blue-600 rounded transition-colors duration-200 hover:bg-blue-50 disabled:opacity-50"
            onClick={() => onEdit(memo)}
            disabled={isDeleting}
          >
            編集
          </button>
          <button
            className="px-3 py-1 text-sm text-red-600 rounded transition-colors duration-200 hover:bg-red-50 disabled:opacity-50"
            onClick={() => onDelete(memo.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function MemosPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMemoId, setSelectedMemoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/memos");
      if (!res.ok) {
        throw new Error("メモの取得に失敗しました");
      }
      const data = await res.json();
      setMemos(data);
      setError(null);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "メモの取得に失敗しました"
      ) {
        setError(null);
      } else {
        setError("メモの取得に失敗しました");
      }
      setMemos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (selectedMemoId === null) {
        response = await fetch("/api/memos", {
          method: "POST",
          body: JSON.stringify({ title, content }),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await fetch(`/api/memos/${selectedMemoId}`, {
          method: "PUT",
          body: JSON.stringify({ title, content }),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "保存に失敗しました");
      }

      resetForm();
      await fetchMemos();
    } catch (error) {
      setError(error instanceof Error ? error.message : "保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (memo: Memo) => {
    setSelectedMemoId(memo.id);
    setTitle(memo.title);
    setContent(memo.content);
    setIsPreview(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("削除に失敗しました");
      await fetchMemos();
    } catch (error) {
      setError("削除に失敗しました");
    } finally {
      setIsDeleting(null);
    }
  };

  const resetForm = () => {
    setSelectedMemoId(null);
    setTitle("");
    setContent("");
    setError(null);
    setIsPreview(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;
    const previousChar = newContent[cursorPosition - 1];
    const currentLine =
      newContent.slice(0, cursorPosition).split("\n").pop() || "";
    const previousLine =
      newContent.slice(0, cursorPosition).split("\n").slice(-2)[0] || "";

    // リストの自動インデント
    if (previousChar === "\n" && previousLine.trim().startsWith("- ")) {
      const indent = previousLine.match(/^\s*/)?.[0] || "";
      const newText =
        newContent.slice(0, cursorPosition) +
        indent +
        "- " +
        newContent.slice(cursorPosition);
      setContent(newText);
      // カーソル位置を調整
      setTimeout(() => {
        e.target.selectionStart = cursorPosition + indent.length + 2;
        e.target.selectionEnd = cursorPosition + indent.length + 2;
      }, 0);
      return;
    }

    setContent(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = textarea.value;
      const beforeCursor = content.slice(0, start);
      const afterCursor = content.slice(end);
      const currentLineStart = beforeCursor.lastIndexOf("\n") + 1;
      const currentLine = beforeCursor.slice(currentLineStart);
      const indent = currentLine.match(/^\s*/)?.[0] || "";

      // Shift + Tab でインデントを減らす
      if (e.shiftKey) {
        // 現在のインデントから2スペース分を削除
        const newIndent = indent.replace(/  $/, "");
        const newContent =
          content.slice(0, currentLineStart) +
          newIndent +
          currentLine.trimLeft() +
          afterCursor;
        setContent(newContent);
        setTimeout(() => {
          textarea.selectionStart = start - (indent.length - newIndent.length);
          textarea.selectionEnd = end - (indent.length - newIndent.length);
        }, 0);
      } else {
        // 通常のTabでインデントを増やす
        const newContent =
          content.slice(0, currentLineStart) +
          indent +
          "  " +
          currentLine +
          afterCursor;
        setContent(newContent);
        setTimeout(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = end + 2;
        }, 0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative">
              <p>{error}</p>
              <button
                className="absolute top-3 right-3"
                onClick={() => setError(null)}
              >
                ×
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 編集フォーム */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {selectedMemoId ? "メモを編集" : "新規メモ作成"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 caret-gray-900"
                    placeholder="タイトルを入力"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      内容
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPreview(!isPreview)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      {isPreview ? "編集" : "プレビュー"}
                    </button>
                  </div>
                  {isPreview ? (
                    <div className="prose prose-slate max-w-none p-4 border rounded-md bg-white min-h-[300px] overflow-auto prose-headings:text-gray-900 prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-code:text-gray-900 prose-a:text-indigo-600 prose-blockquote:text-gray-900 prose-hr:text-gray-900">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold mb-4 text-gray-900">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-bold mb-3 text-gray-900">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold mb-2 text-gray-900">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-4 text-gray-900">{children}</p>
                          ),
                          ul: ({ children, ...props }) => {
                            const level = (props as any).level || 0;
                            const markers = ["•", "○", "▪", "▫", "▹"];
                            const marker = markers[level % markers.length];

                            return (
                              <ul className="list-none pl-6 mb-4 text-gray-900">
                                {React.Children.map(children, (child) => {
                                  if (
                                    React.isValidElement<{
                                      children: React.ReactNode;
                                    }>(child)
                                  ) {
                                    return (
                                      <li className="mb-1 text-gray-900 relative">
                                        <span className="absolute -left-4">
                                          {marker}
                                        </span>
                                        {child.props.children}
                                      </li>
                                    );
                                  }
                                  return child;
                                })}
                              </ul>
                            );
                          },
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-6 mb-4 text-gray-900">
                              {children}
                            </ol>
                          ),
                          li: ({ children, ...props }) => {
                            const level = (props as any).level || 0;
                            const markers = ["•", "○", "▪", "▫", "▹"];
                            const marker = markers[level % markers.length];

                            return (
                              <li className="mb-1 text-gray-900 relative">
                                <span className="absolute -left-4">
                                  {marker}
                                </span>
                                {children}
                              </li>
                            );
                          },
                          code: ({ children }) => (
                            <code className="bg-gray-100 rounded px-1 py-0.5 text-gray-900">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto text-gray-900">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4 text-gray-900">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={handleContentChange}
                      onKeyDown={handleKeyDown}
                      className="w-full p-2 border rounded-md min-h-[300px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 caret-gray-900"
                      placeholder="マークダウン形式で入力"
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isSubmitting
                      ? "保存中..."
                      : selectedMemoId
                      ? "更新"
                      : "保存"}
                  </button>
                  {selectedMemoId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      キャンセル
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* メモ一覧 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">メモ一覧</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-600">読み込み中...</p>
                </div>
              ) : memos.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                  メモがありません
                </div>
              ) : (
                <div className="space-y-4">
                  {memos.map((memo) => (
                    <MemoCard
                      key={memo.id}
                      memo={memo}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isDeleting={isDeleting === memo.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

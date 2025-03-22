// app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";

// ユーザー型の定義
type User = {
  id: number;
  name: string;
  email: string;
};

const UserListItem = React.memo(
  ({
    user,
    onEdit,
    onDelete,
    isDeleting,
  }: {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
    isDeleting: boolean;
  }) => (
    <li className="mb-2 p-3 flex justify-between items-center border rounded hover:border-gray-400 hover:shadow-sm bg-white">
      <span className="flex-1">
        {user.name} ({user.email})
      </span>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 text-sm text-blue-600 rounded transition-colors duration-200 hover:bg-blue-50 cursor-pointer hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onEdit(user)}
          disabled={isDeleting}
        >
          編集
        </button>
        <button
          className="px-3 py-1 text-sm text-red-600 rounded transition-colors duration-200 hover:bg-red-50 cursor-pointer hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onDelete(user.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "削除中..." : "削除"}
        </button>
      </div>
    </li>
  )
);

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUserId, setselectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // ユーザー情報取得処理
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (name.trim().length < 2) {
      setError("名前は2文字以上で入力してください");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("有効なメールアドレスを入力してください");
      return false;
    }
    return true;
  };

  // ユーザー追加.更新処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedUserId === null) {
        // 新規追加処理
        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({ name, email }),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // ユーザー情報を更新する処理
        await fetch(`/api/users/${selectedUserId}`, {
          method: "PUT",
          body: JSON.stringify({ name, email }),
          headers: { "Content-Type": "application/json" },
        });
        setselectedUserId(null); // 更新後にフォームをリセット
      }

      setName("");
      setEmail("");

      await fetchUsers(); // データ再取得
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  // 編集ボタンを押した時の処理
  const handleEdit = (user: any) => {
    setselectedUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  // 削除ボタンを押した時の処理
  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "削除中にエラーが発生しました");
      }

      // 削除成功後、ユーザー一覧を更新
      await fetchUsers();
      setError(null); // エラーメッセージをクリア
    } catch (error) {
      console.error("削除エラー:", error);
      setError(
        error instanceof Error ? error.message : "削除中にエラーが発生しました"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const resetForm = () => {
    setselectedUserId(null);
    setName("");
    setEmail("");
    setError(null);
  };

  // ローディング表示
  {
    isLoading && (
      <div className="text-center py-4">
        <p>読み込み中...</p>
      </div>
    );
  }

  // エラーメッセージの表示
  {
    error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <button className="float-right" onClick={() => setError(null)}>
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="text-black max-w-xl mx-auto p-6">
      <h1 className="font-heading text-3xl font-bold border-b pb-2 mb-4">
        ユーザー追加・編集フォーム
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-3"
        aria-label="ユーザー情報フォーム"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            名前
          </label>
          <input
            id="name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            メールアドレス
          </label>
          <input
            id="email"
            className="w-full p-2 border rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                {/* ローディングアイコンのSVGパス */}
              </svg>
              {selectedUserId ? "更新中..." : "追加中..."}
            </span>
          ) : selectedUserId ? (
            "更新"
          ) : (
            "追加"
          )}
        </button>
        {selectedUserId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-300"
            onClick={() => {
              resetForm();
            }}
          >
            キャンセル
          </button>
        )}
      </form>

      <h2 className="font-heading text-2xl font-bold mt-8 mb-4">
        ユーザー一覧
      </h2>
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          ユーザーが登録されていません
        </div>
      ) : (
        <ul className="font-sans">
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting === user.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

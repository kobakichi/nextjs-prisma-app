// app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUserId, setselectedUserId] = useState<number | null>(null);

  // ユーザー情報取得処理
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
    }
  };

  // ユーザー追加.更新処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <div className="text-black max-w-xl mx-auto p-6">
      <h1 className="font-heading text-3xl font-bold border-b pb-2 mb-4">
        ユーザー追加・編集フォーム
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {selectedUserId ? "更新" : "追加"}
        </button>
        {selectedUserId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-300"
            onClick={() => {
              setselectedUserId(null);
              setName("");
              setEmail("");
            }}
          >
            キャンセル
          </button>
        )}
      </form>

      <h2 className="font-heading text-2xl font-bold mt-8 mb-4">
        ユーザー一覧
      </h2>
      <ul className="font-sans">
        {users.map((user: any) => (
          <li key={user.id} className="mb-2 flex justify-between items-center">
            {user.name} ({user.email})
            <button
              className="ml-4 text-sm underline text-blue-600"
              onClick={() => handleEdit(user)}
            >
              編集
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

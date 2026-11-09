import Link from "next/link";

export default function TagsNotFound() {
  return (
    <div>
      <h1>Тег не найден</h1>
      <p className="muted">Такого тега нет ни у одной статьи</p>
      <Link href="/tags" className="button">
        Все теги
      </Link>
    </div>
  );
}

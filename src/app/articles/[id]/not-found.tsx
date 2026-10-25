import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div>
      <h1>Статья не найдена</h1>
      <p className="muted">Возможно, она была удалена или адрес указан неверно.</p>
      <Link href="/articles" className="button">
        К списку статей
      </Link>
    </div>
  )
}
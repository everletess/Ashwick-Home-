import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap page-head" style={{ paddingBottom: 140 }}>
      <h1 className="h1">Piece not found.</h1>
      <div className="btns">
        <Link href="/collections/all" className="btn">Shop the collection</Link>
      </div>
    </main>
  );
}

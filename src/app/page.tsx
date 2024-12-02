import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10">
      <p>Olá mundo! Que lugar vazio...</p>
      <p className="my-5">Lugar que faz alguma coisa</p>
      <Link href="/admin/produtos">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Ir para Produtos
        </button>
      </Link>
      <div className="mt-4 text-gray-600">
        <p>
          Usei o mockAPI, segue o link{" "}
          <a href="https://67438360b7464b1c2a650ba6.mockapi.io/api/v1/produtos" target="_blank" rel="noopener noreferrer">
            https://67438360b7464b1c2a650ba6.mockapi.io/api/v1/produtos
          </a>
        </p>
      </div>
    </div>
  );
}

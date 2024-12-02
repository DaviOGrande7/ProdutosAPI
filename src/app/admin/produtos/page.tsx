"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Produto } from ".../components/Interface";

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch(
          "https://67438360b7464b1c2a650ba6.mockapi.io/api/v1/produtos"
        );
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const diminuirQuantidade = async (
    produtoId: string,
    quantidadeAtual: number
  ) => {
    if (quantidadeAtual <= 0) {
      alert("Quantidade em estoque já está zerada!");
      return;
    }

    try {
      const novaQuantidade = quantidadeAtual - 1;

      await fetch(
        `https://67438360b7464b1c2a650ba6.mockapi.io/api/v1/produtos/${produtoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qt_estoque: novaQuantidade }),
        }
      );

      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.id === produtoId
            ? { ...produto, qt_estoque: novaQuantidade }
            : produto
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar a quantidade:", error);
    }
  };

  const calcularResumo = () => {
    if (produtos.length === 0)
      return { total: 0, maisCaro: null, menorEstoque: null };

    const maisCaro = produtos.reduce((prev, current) =>
      current.preco > prev.preco ? current : prev
    );

    const menorEstoque = produtos.reduce((prev, current) =>
      current.qt_estoque < prev.qt_estoque ? current : prev
    );

    return {
      total: produtos.length,
      maisCaro,
      menorEstoque,
    };
  };

  const resumo = calcularResumo();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Produtos</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Preço
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Quantidade em Estoque
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr
              key={produto.id}
              className={`${
                produto.qt_estoque < 5
                  ? "bg-yellow-100"
                  : produto.qt_estoque >= 20
                  ? "bg-green-100"
                  : "bg-white"
              }`}
            >
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  href={`/${produto.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {produto.nome}
                </Link>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                R$ {produto.preco.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {produto.qt_estoque}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() =>
                    diminuirQuantidade(produto.id, produto.qt_estoque)
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Diminuir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Resumo</h2>
        <p className="mb-2">
          <strong>Quantidade de Produtos:</strong> {resumo.total}
        </p>
        <p className="mb-2">
          <strong>Produto com Maior Preço:</strong>{" "}
          {resumo.maisCaro
            ? `${resumo.maisCaro.nome} - R$ ${resumo.maisCaro.preco.toFixed(2)}`
            : "N/A"}
        </p>
        <p>
          <strong>Produto com Menor Estoque:</strong>{" "}
          {resumo.menorEstoque
            ? `${resumo.menorEstoque.nome} - ${resumo.menorEstoque.qt_estoque} unidades`
            : "N/A"}
        </p>
      </div>
    </div>
  );
}

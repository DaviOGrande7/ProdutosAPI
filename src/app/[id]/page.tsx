"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Produto } from "../components/Interface";

export default function ProdutoDetalhe() {
  const { id } = useParams(); // Obtém o ID do parâmetro de rota
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(
          `https://67438360b7464b1c2a650ba6.mockapi.io/api/v1/produtos/${id}`
        );
        const data = await response.json();
        setProduto(data);
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduto(); 
  }, [id]);

  const aumentarQuantidade = async () => {
    if (!produto) return;

    try {
      const novaQuantidade = produto.qt_estoque + 1;

      await fetch(
        `https://67438360b7464b1c2a650ba6.mockapi.io/api/v1/produtos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qt_estoque: novaQuantidade }),
        }
      );

      setProduto((prevProduto) =>
        prevProduto ? { ...prevProduto, qt_estoque: novaQuantidade } : prevProduto
      );
    } catch (error) {
      console.error("Erro ao atualizar a quantidade:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Produto</h1>
      <div className="p-4 border rounded shadow mb-4">
        <p>
          <strong>Nome:</strong> {produto.nome}
        </p>
        <p>
          <strong>Preço:</strong> R$ {produto.preco.toFixed(2)}
        </p>
        <p>
          <strong>Quantidade em Estoque:</strong> {produto.qt_estoque}
        </p>
        <p
          className={`mt-2 p-2 rounded text-white ${
            produto.qt_estoque < 5
              ? "bg-yellow-500"
              : produto.qt_estoque >= 20
              ? "bg-green-500"
              : "bg-gray-500"
          }`}
        >
          {produto.qt_estoque < 5
            ? "ESTOQUE INSUFICIENTE"
            : "ESTOQUE SUFICIENTE"}
        </p>
      </div>
      <button
        onClick={aumentarQuantidade}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Aumentar Estoque
      </button>
    </div>
  );
}

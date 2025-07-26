import { getUserById } from "@/lib/api/users";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const user = await getUserById(params.id); // <-- isso é válido aqui

  if (!user) {
    notFound();
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Usuário</h1>
      <div className="space-y-2">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Nome:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Telefone:</strong> {user.phone}
        </p>
        <p>
          <strong>Função:</strong> {user.role}
        </p>
        <p>
          <strong>Status:</strong> {user.isActive ? "Ativo" : "Inativo"}
        </p>
        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>
    </main>
  );
}

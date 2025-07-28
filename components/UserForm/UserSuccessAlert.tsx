import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function UserSuccessAlert() {
  return (
    <Alert>
      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
      <AlertTitle>Sucesso!</AlertTitle>
      <AlertDescription>Usuário atualizado com sucesso.</AlertDescription>
    </Alert>
  );
}

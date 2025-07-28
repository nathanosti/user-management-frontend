import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Ban } from "lucide-react";

export function UserAccessDenied() {
  return (
    <div className="max-w-xl mx-auto mt-20 px-4">
      <Alert variant="destructive">
        <div className="flex items-start gap-3">
          <Ban className="w-5 h-5 mt-1 text-red-600" />
          <div>
            <AlertTitle className="text-lg font-semibold">
              Acesso negado
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Você não tem permissão para visualizar esse perfil. Você será
              redirecionado em instantes...
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}

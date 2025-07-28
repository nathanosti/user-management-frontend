import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { UserSuccessAlert } from "./UserSuccessAlert";

export function UserFormFields({
  userId,
  watch,
  register,
  errors,
  setValue,
  isSubmitting,
  showSuccess,
}: any) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSuccess && <UserSuccessAlert />}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={watch("avatar")} />
              <AvatarFallback>{watch("name")?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label>ID</Label>
              <span className="block text-sm break-all">{userId}</span>
            </div>
          </div>

          {[
            { label: "Nome", field: "name", type: "text" },
            { label: "Email", field: "email", type: "email" },
            { label: "Telefone", field: "phone", type: "tel" },
            { label: "Data de Nascimento", field: "birthDate", type: "date" },
            { label: "URL do Avatar", field: "avatar", type: "url" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <Label>{label}</Label>
              <Input type={type} {...register(field)} />
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]?.message}</p>
              )}
            </div>
          ))}

          <div>
            <Label>Cargo</Label>
            <select
              {...register("role")}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={watch("isActive")}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
            <Input type="hidden" {...register("isActive")} />
            <Label>Usuário Ativo</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => history.back()}
            disabled={isSubmitting}
          >
            <ArrowLeftIcon className="mr-2" />
            Voltar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

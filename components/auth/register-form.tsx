"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerAction } from "@/app/actions/auth-actions";
import { Button } from "@/components/button";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations";

export function RegisterForm() {
  const { toast, showError, showSuccess } = useToast();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    const formData = new FormData();

    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("password", values.password);

    const result = await registerAction(formData);

    if (result?.error) {
      showError(result.error);

      form.setError("root", {
        message: result.error,
      });

      return;
    }

    showSuccess("Account created successfully");

    form.reset();
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            {...form.register("name")}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            {...form.register("email")}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <p className="text-sm text-red-600">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>
    </>
  );
}
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/form-input";
import { SubmitButton } from "@/components/shared/submit-button";
import { Form } from "@/components/ui/form";
import { useCreateTag } from "@/hooks/use-tags";
import { tagSchema, type TagFormValues } from "@/lib/validations";

export function TagForm() {
  const createTag = useCreateTag();

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: TagFormValues) => {
    createTag.mutate(values, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <FormInput
          control={form.control}
          name="name"
          label="Tag name"
          placeholder="e.g. tutorial"
          className="flex-1"
          disabled={createTag.isPending}
        />
        <SubmitButton isLoading={createTag.isPending}>
          Add Tag
        </SubmitButton>
      </form>
    </Form>
  );
}

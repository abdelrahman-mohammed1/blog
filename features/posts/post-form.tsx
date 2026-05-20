"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/form-input";
import { SubmitButton } from "@/components/shared/submit-button";
import { RichTextEditor } from "@/features/posts/rich-text-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useCreatePost } from "@/hooks/use-posts";
import { useTags } from "@/hooks/use-tags";
import { ROUTES } from "@/lib/constants";
import { generateSlug } from "@/lib/slug";
import { postSchema, type PostFormValues } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function PostForm() {
  const router = useRouter();
  const createPost = useCreatePost();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: tags = [], isLoading: tagsLoading } = useTags();
  const slugManuallyEdited = useRef(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      categories: [],
      tags: "",
    },
  });

  const selectedCategories = form.watch("categories");

  const onSubmit = (values: PostFormValues) => {
    createPost.mutate(values, {
      onSuccess: () => router.push(ROUTES.posts),
    });
  };

  const toggleCategory = (id: string) => {
    const current = form.getValues("categories");
    if (current.includes(id)) {
      form.setValue(
        "categories",
        current.filter((c) => c !== id),
        { shouldValidate: true }
      );
    } else {
      form.setValue("categories", [...current, id], {
        shouldValidate: true,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8"
      >
        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormInput
              control={form.control}
              name="title"
              label="Title"
              placeholder="Post title"
              className="sm:col-span-2"
              disabled={createPost.isPending}
              onChange={(value) => {
                if (!slugManuallyEdited.current) {
                  form.setValue("slug", generateSlug(value), {
                    shouldValidate: true,
                  });
                }
              }}
            />
            <FormInput
              control={form.control}
              name="slug"
              label="Slug"
              placeholder="post-url-slug"
              disabled={createPost.isPending}
              onChange={() => {
                slugManuallyEdited.current = true;
              }}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={createPost.isPending || tagsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag._id} value={tag._id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {categoriesLoading && (
                      <p className="text-sm text-muted-foreground">
                        Loading categories...
                      </p>
                    )}
                    {!categoriesLoading && categories.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No categories available. Create one first.
                      </p>
                    )}
                    {categories.map((cat) => {
                      const selected = selectedCategories.includes(cat._id);
                      return (
                        <Badge
                          key={cat._id}
                          variant={selected ? "default" : "outline"}
                          className="cursor-pointer rounded-lg px-3 py-1.5 transition-all hover:scale-[1.02]"
                          onClick={() => toggleCategory(cat._id)}
                        >
                          {cat.name}
                          {selected && <X className="ml-1 size-3" />}
                        </Badge>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    disabled={createPost.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <SubmitButton
            isLoading={createPost.isPending}
            disabled={tagsLoading || categoriesLoading}
          >
            Publish Post
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

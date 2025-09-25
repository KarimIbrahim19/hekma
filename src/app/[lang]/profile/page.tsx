'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDictionary } from '@/lib/dictionary';
import { type Locale } from '@/i18n-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const [dictionary, setDictionary] = useState<any>(null);
  const { user, api, setUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
      setIsLoading(false);
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await api.put('/users/profile', {
        name: data.name,
        phone: data.phone
      });

      const updatedUser = { ...user!, name: data.name, phone: data.phone };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: dictionary.profile.profileUpdated,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Update Failed",
        description: error.response?.data?.message || "An error occurred.",
      });
    }
  };

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.profile.title}</h1>
        <p className="text-muted-foreground">{dictionary.profile.description}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.profile.name}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.profile.email}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.auth.phone}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Updating...' : dictionary.profile.updateProfile}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

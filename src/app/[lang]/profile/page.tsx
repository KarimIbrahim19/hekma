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

  const profileForm = useForm<ProfileFormValues>({
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

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: dictionary?.profile.currentPasswordRequired || "Current password is required." }),
    newPassword: z.string().min(6, { message: dictionary?.profile.passwordTooShort || "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: dictionary?.profile.passwordsDontMatch || "Passwords don't match",
    path: ["confirmPassword"],
  });

  type PasswordFormValues = z.infer<typeof passwordSchema>;

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
      setIsLoading(false);
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
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
  
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await api.put('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast({
        title: dictionary.profile.passwordUpdated,
      });
      passwordForm.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: dictionary.profile.passwordUpdateFailed,
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
        <div className="space-y-8">
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
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.profile.title}</h1>
        <p className="text-muted-foreground">{dictionary.profile.description}</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>{dictionary.profile.profileInfo}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <FormField
                control={profileForm.control}
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
                control={profileForm.control}
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
                control={profileForm.control}
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

              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting ? dictionary.profile.updating : dictionary.profile.updateProfile}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>{dictionary.profile.changePassword}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.profile.currentPassword}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.profile.newPassword}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.profile.confirmPassword}</FormLabel>

                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={passwordForm.formState.isSubmitting}>
                {passwordForm.formState.isSubmitting ? dictionary.profile.updating : dictionary.profile.updatePassword}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

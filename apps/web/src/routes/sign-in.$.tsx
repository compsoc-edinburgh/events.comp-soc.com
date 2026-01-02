import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { AuthWindow } from '@/components/layout/auth-window'

export const Route = createFileRoute('/sign-in/$')({
  component: SignInPage,
})

const AUTH_STYLE = {
  baseTheme: dark,
  elements: {
    cardBox: 'shadow-none! bg-transparent! border-none!',
    card: 'bg-transparent! shadow-none! p-0',
    otpCodeFieldInput: 'bg-neutral-800 border-neutral-700 text-neutral-100',
    footer: 'hidden!',
  },
  variables: {
    colorPrimary: '#dc2626',
    colorBackground: 'transparent',
    colorInputBackground: '#262626',
    colorInputText: '#e4e4e4',
  },
}

function SignInPage() {
  return (
    <AuthWindow title="Sign In — CompSoc">
      <SignIn appearance={AUTH_STYLE} />
    </AuthWindow>
  )
}

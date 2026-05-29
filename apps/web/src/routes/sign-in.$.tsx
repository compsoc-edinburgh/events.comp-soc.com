import { Link, createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/tanstack-react-start'
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
      <div className="flex flex-col items-center">
        <SignIn appearance={AUTH_STYLE} />
        <p className="text-sm text-neutral-400 pb-10">
          Don't have an account?{' '}
          <Link to="/sign-up/$" className="text-red-500 hover:text-red-400">
            Sign in
          </Link>
        </p>
      </div>
    </AuthWindow>
  )
}

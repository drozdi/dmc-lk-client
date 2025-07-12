import { VerificationForm } from '../../features/auth/verification-form'
export function VerificatinPage() {
	return (
		<div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-3'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Проверка
					</h2>
				</div>
				<VerificationForm />
			</div>
		</div>
	)
}

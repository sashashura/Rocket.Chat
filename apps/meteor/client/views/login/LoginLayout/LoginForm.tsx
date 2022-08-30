import { FieldGroup, TextInput, Field, PasswordInput, ButtonGroup, Button, Callout } from '@rocket.chat/fuselage';
import { Form, ActionLink } from '@rocket.chat/layout';
import { useSetting, useTranslation } from '@rocket.chat/ui-contexts';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';

import LoginEmailConfirmationForm from './LoginEmailConfirmation';
import { useLoginMethod } from './hooks/useLoginMethod';
import { DispatchLoginRouter } from './hooks/useLoginRouter';

type LoginErrors =
	| 'error-user-is-not-activated'
	| 'error-invalid-email'
	| 'error-login-blocked-for-ip'
	| 'error-login-blocked-for-user'
	| 'error-license-user-limit-reached'
	| 'user-not-found'
	| 'error-app-user-is-not-allowed-to-login';

export const LoginForm = ({ setLoginRoute }: { setLoginRoute: DispatchLoginRouter }): ReactElement => {
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		getValues,
		formState: { errors },
	} = useForm<{
		email?: string;
		username: string;
		password: string;
	}>({
		mode: 'onChange',
	});

	const [errorOnSubmit, setErrorOnSubmit] = useState<LoginErrors | undefined>(undefined);

	const isResetPasswordAllowed = useSetting('Accounts_PasswordReset');

	const t = useTranslation();

	const login = useLoginMethod();

	if (errors.email?.type === 'invalid-email') {
		return (
			<LoginEmailConfirmationForm
				onBackToLogin={() => clearErrors('email')}
				email={getValues('username')?.includes('@') ? getValues('username') : undefined}
			/>
		);
	}

	return (
		<Form
			onSubmit={handleSubmit(async (data) => {
				try {
					await login(data.username, data.password);
				} catch (error: any) {
					if ([error.error, error.errorType].includes('error-invalid-email')) {
						setError('email', { type: 'invalid-email', message: t('Invalid_email') });
					}

					if ('error' in error) {
						setErrorOnSubmit(error.error);
						return;
					}

					setErrorOnSubmit('user-not-found');
					setError('username', { type: 'user-not-found', message: t('User_not_found') });
					setError('password', { type: 'user-not-found', message: t('User_not_found') });
				}
			})}
		>
			<Form.Header>
				<Form.Title>{t('Login')}</Form.Title>
			</Form.Header>
			<Form.Container>
				<FieldGroup>
					<Field>
						<Field.Label htmlFor='username'>{t('Email_or_username')}</Field.Label>
						<Field.Row>
							<TextInput
								{...register('username', {
									required: true,
								})}
								placeholder={t('Email_Placeholder')}
								error={errors.username?.message}
								aria-invalid={errors.username ? 'true' : 'false'}
								id='username'
							/>
						</Field.Row>
						{errors.username && errors.username.type === 'required' && (
							<Field.Error>
								{t('The_field_is_required', {
									postProcess: 'sprintf',
									sprintf: [t('Username')],
								})}
							</Field.Error>
						)}
					</Field>

					<Field>
						<Field.Label htmlFor='password'>{t('Password')}</Field.Label>
						<Field.Row>
							<PasswordInput
								{...register('password', {
									required: true,
								})}
								placeholder={'*****'}
								error={errors.password?.message}
								aria-invalid={errors.password ? 'true' : 'false'}
								id='password'
							/>
						</Field.Row>
						{errors.password && errors.password.type === 'required' && (
							<Field.Error>
								{t('The_field_is_required', {
									postProcess: 'sprintf',
									sprintf: [t('Password')],
								})}
							</Field.Error>
						)}
						{isResetPasswordAllowed && (
							<Field.Row justifyContent='end'>
								<Field.Link
									onClick={(e): void => {
										e.preventDefault();
										setLoginRoute('reset-password');
									}}
								>
									Forgot your password?
								</Field.Link>
							</Field.Row>
						)}
					</Field>
				</FieldGroup>
				<FieldGroup>
					{errorOnSubmit === 'error-user-is-not-activated' && <Callout type='warning'>{t('Wait_activation_warning')}</Callout>}

					{errorOnSubmit === 'error-app-user-is-not-allowed-to-login' && (
						<Callout type='danger'>{t('App_user_not_allowed_to_login')}</Callout>
					)}
					{errorOnSubmit === 'user-not-found' && <Callout type='danger'>{t('User_not_found_or_incorrect_password')}</Callout>}
					{errorOnSubmit === 'error-login-blocked-for-ip' && <Callout type='danger'>{t('Error_login_blocked_for_ip')}</Callout>}
					{errorOnSubmit === 'error-login-blocked-for-user' && <Callout type='danger'>{t('Error_login_blocked_for_user')}</Callout>}

					{errorOnSubmit === 'error-license-user-limit-reached' && (
						<Callout type='warning'>{t('error-license-user-limit-reached')}</Callout>
					)}
					{/* error-invalid-email */}
				</FieldGroup>
			</Form.Container>
			<Form.Footer>
				<ButtonGroup stretch>
					<Button type='submit' primary>
						{t('Login')}
					</Button>
				</ButtonGroup>
				<p>
					<Trans i18nKey='registration.page.login.register'>
						New here? <ActionLink onClick={(): void => setLoginRoute('register')}>Register</ActionLink>
					</Trans>
				</p>
			</Form.Footer>
		</Form>
	);
};

export default LoginForm;
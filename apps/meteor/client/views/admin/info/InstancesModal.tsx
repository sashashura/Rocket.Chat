import type { Serialized } from '@rocket.chat/core-typings';
import { Modal, Button, Accordion } from '@rocket.chat/fuselage';
import { OperationResult } from '@rocket.chat/rest-typings';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React, { ReactElement } from 'react';

import { useFormatDateAndTime } from '../../../hooks/useFormatDateAndTime';
import DescriptionList from './DescriptionList';

type InstancesModalProps = {
	instances: Serialized<OperationResult<'GET', '/v1/instances.get'>>['instances'];
	onClose: () => void;
};
const InstancesModal = ({ instances = [], onClose }: InstancesModalProps): ReactElement => {
	const t = useTranslation();

	const formatDateAndTime = useFormatDateAndTime();

	console.log(instances);

	return (
		<Modal width='x600'>
			<Modal.Header>
				<Modal.Title>{t('Instances')}</Modal.Title>
				<Modal.Close onClick={onClose} />
			</Modal.Header>
			<Modal.Content>
				<Accordion>
					{instances.map(({ address, broadcastAuth, currentStatus, instanceRecord }) => (
						<Accordion.Item title={address} key={address}>
							<DescriptionList>
								<DescriptionList.Entry label={t('Address')}>{address}</DescriptionList.Entry>
								<DescriptionList.Entry label={t('Auth')}>{broadcastAuth ? 'true' : 'false'}</DescriptionList.Entry>
								{currentStatus && (
									<>
										<DescriptionList.Entry
											label={
												<>
													{t('Current_Status')} &gt; {t('Connected')}
												</>
											}
										>
											{currentStatus.connected ? 'true' : 'false'}
										</DescriptionList.Entry>
										<DescriptionList.Entry
											label={
												<>
													{t('Current_Status')} &gt; {t('Retry_Count')}
												</>
											}
										>
											{currentStatus.retryCount}
										</DescriptionList.Entry>
										<DescriptionList.Entry
											label={
												<>
													{t('Current_Status')} &gt; {t('Status')}
												</>
											}
										>
											{currentStatus.status}
										</DescriptionList.Entry>
									</>
								)}
								{instanceRecord && (
									<>
										<DescriptionList.Entry
											label={
												<>
													{t('Instance_Record')} &gt; {t('ID')}
												</>
											}
										>
											{instanceRecord._id}
										</DescriptionList.Entry>
										<DescriptionList.Entry
											label={
												<>
													{t('Instance_Record')} &gt; {t('PID')}
												</>
											}
										>
											{instanceRecord.pid}
										</DescriptionList.Entry>
										<DescriptionList.Entry
											label={
												<>
													{t('Instance_Record')} &gt; {t('Created_at')}
												</>
											}
										>
											{formatDateAndTime(instanceRecord._createdAt)}
										</DescriptionList.Entry>
										<DescriptionList.Entry
											label={
												<>
													{t('Instance_Record')} &gt; {t('Updated_at')}
												</>
											}
										>
											{formatDateAndTime(instanceRecord._updatedAt)}
										</DescriptionList.Entry>
									</>
								)}
							</DescriptionList>
						</Accordion.Item>
					))}
				</Accordion>
			</Modal.Content>
			<Modal.Footer>
				<Modal.FooterControllers>
					<Button primary onClick={onClose}>
						{t('Close')}
					</Button>
				</Modal.FooterControllers>
			</Modal.Footer>
		</Modal>
	);
};

export default InstancesModal;

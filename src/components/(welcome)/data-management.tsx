import { SectionTitle } from '../ui';
import { AppMiscCards } from './misc-cards';

type Props = {
  observer?: IntersectionObserver;
};

export const AppDataManagement = ({ observer }: Props) => {
  return (
    <div className='flex flex-col gap-y-5'>
      <SectionTitle className='px-5'>Data Management</SectionTitle>
      <div className='border-t-[1px] border-t-dracula-pink pb-5'></div>

      <div className=' min-h-[50vh]'>
        <div className='flex flex-col gap-y-5'>
          <div className='mx-auto flex lg:flex-row flex-col gap-y-3'>
            <AppMiscCards observer={observer} />
          </div>
        </div>
      </div>
    </div>
  );
};

import { LucideSend } from 'lucide-react';
import { Container } from './ui';

const emailBody = encodeURI(`Hi John,

I would like to sponsor and support Test Labs.`);

export default () => (
  <div className='mt-20'>
    <Container>
      <footer className='px-4 pb-5'>
        <div className='flex flex-row justify-between'>
          <div className='text-gray-400 text-sm flex flex-col'>
            <span>Lightzane &copy; 2024</span>
            <span className='text-xs'>For testing purposes only</span>
          </div>
          <div className='flex items-center gap-x-2 text-gray-400'>
            <a
              href={`mailto:bhest.pat@gmail.com?subject=Sponsor Test Labs&body=${emailBody}`}>
              <LucideSend size={20} />
            </a>
          </div>
        </div>
      </footer>
    </Container>
  </div>
);

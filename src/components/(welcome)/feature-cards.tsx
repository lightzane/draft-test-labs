import { AppFeatureCard } from './feature-card';

type Feature = {
  title: string;
  description: string;
  url: string;
};

const features: Feature[] = [
  {
    title: 'Registration',
    description:
      'Validate input fields on the form such as names, and other text fields.',
    url: '#registration', // will be appended after README (see feature-card.tsx)
  },
  {
    title: 'Accounts',
    description:
      'Each user has a profile, number of appreciations, posts, and comments.',
    url: '#accounts',
  },
  {
    title: 'Posts',
    description:
      'Users can create post with text, image which may be saved and liked.',
    url: '#posts',
  },
  {
    title: 'Comments',
    description: 'Add comments on post, like and reply to other comments.',
    url: '#comments',
  },
];

type Props = {
  observer?: IntersectionObserver;
};

export const AppFeatureCards = ({ observer }: Props) => {
  return (
    <>
      {features.map(({ title, description, url }) => (
        <AppFeatureCard
          key={title}
          title={title}
          description={description}
          url={url}
          observer={observer}
        />
      ))}
    </>
  );
};

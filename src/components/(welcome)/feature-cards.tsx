import { AppFeatureCard } from './feature-card';

type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: 'Registration',
    description:
      'Validate input fields on the form such as names, and other text fields.',
  },
  {
    title: 'Accounts',
    description:
      'Each user has a profile, number of appreciations, posts, and comments.',
  },
  {
    title: 'Posts',
    description:
      'Users can create post with text, image which may be saved and liked.',
  },
  {
    title: 'Comments',
    description: 'Add comments on post, like and reply to other comments.',
  },
];

type Props = {
  observer?: IntersectionObserver;
};

export const AppFeatureCards = ({ observer }: Props) => {
  return (
    <>
      {features.map(({ title, description }) => (
        <AppFeatureCard
          key={title}
          title={title}
          description={description}
          observer={observer}
        />
      ))}
    </>
  );
};

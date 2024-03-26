import { useEffect, useState } from 'react';
import { Comment, User } from '../models';
import { usePostStore } from '../stores';
import { kebab, metricCount } from '../utils';

type Props = {
  user: User;
};

type CountValueProps = {
  countValue: CountValue;
};

type CountValue = {
  value: number;
  name: string;
};

export default function AppCounters(props: Readonly<Props>) {
  const { user } = props;
  const { posts } = usePostStore();

  const [countValues, setCountValues] = useState<CountValue[]>([]);

  useEffect(() => {
    /** Likes received from comments */
    let fromComments = 0;

    const countMyCommentsOtherPeopleLike = (comment: Comment) => {
      fromComments += comment.likes.filter(
        (id) => id !== user.id && comment.userId === user.id,
      ).length;

      comment.replies.forEach(countMyCommentsOtherPeopleLike);
    };

    const myPosts = posts.filter((p) => {
      p.comments.forEach(countMyCommentsOtherPeopleLike);
      return p.userId === user.id;
    });

    const mySavedPosts = user.savedPosts.length;

    /** Likes received from my posts */
    const fromPosts = myPosts.reduce((acc, post) => {
      // Do not count self
      return acc + post.likes.filter((id) => id !== user.id).length;
    }, 0);

    const countValues: CountValue[] = [
      {
        name: 'Posts',
        value: myPosts.length,
      },
      {
        name: 'Appreciations',
        value: fromPosts + fromComments,
      },
      {
        name: 'Saved',
        value: mySavedPosts,
      },
    ];

    setCountValues(countValues);
  }, [user, posts]);

  return (
    <div className='flex flex-row items-center gap-x-5'>
      {countValues.map((countValue) => (
        <AppCountValue
          key={countValue.name + Date.now().toString()}
          countValue={countValue}
        />
      ))}
    </div>
  );
}

const AppCountValue = (props: CountValueProps) => {
  const { value, name } = props.countValue;

  return (
    <div
      className='flex flex-col items-center'
      data-testid={`${kebab(name)}-counter`}>
      <h3 className='text-lg font-bold' data-testid='counter-value'>
        {metricCount(value, 1)}
      </h3>
      <span className='text-sm text-gray-400' data-testid='counter-name'>
        {name}
      </span>
    </div>
  );
};

import {Button} from './Button';
import {PageHeader, Text} from './Text';
import {VoidCartSuggestions} from './VoidCartSuggestions';

export function NotFound({type = 'page'}: {type?: string}) {
  const heading = `We’ve lost this ${type}`;
  const description = `We couldn’t find the ${type} you’re looking for. Try checking the URL or heading back to the home page.`;

  return (
    <>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        <Button width="auto" variant="secondary" to={'/'}>
          Take me to the home page
        </Button>
      </PageHeader>
      <div className="px-6 pb-16 md:px-14 lg:px-20">
        <VoidCartSuggestions layout="page" count={4} />
      </div>
    </>
  );
}

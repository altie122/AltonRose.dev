import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Star } from "lucide-react"
import abbreviate from "number-abbreviate";

export default function GithubButton({
  repoPath,
  stars,
}: {
  repoPath: string;
  stars?: number;
}) {
  return (
    <Button asChild variant={"outline"} size={"paddingless"}>
      <a href={`https://github.com/${repoPath}`} className='flex flex-row'>
        <div className="py-2 pl-2">
          <img
            src='https://cdn.simpleicons.org/github/000000/ffffff'
            className="size-5"
          />
        </div>
        <Separator orientation='vertical' />
        <div className="py-2 pr-2 text-muted-foreground flex flex-row gap-2">
          <Star className="size-5" />
          <p>{abbreviate(stars ?? 0)}</p>
        </div>
      </a>
    </Button>
  );
}

type NodeVariant =
  | 'straight'
  | 'straightDouble'
  | 'curvedHorizontal'
  | 'curvedHorizontalGray'
  | 'curvedHorizontalSmall'
  | 'curvedVertical';
type NodeTone = 'brand' | 'neutral';

interface NodeProps {
  variant: NodeVariant;
  tone?: NodeTone;
  direction?: 'row' | 'col';
  grow?: boolean;
}

export default function Node({
  variant,
  tone = 'brand',
  direction = 'row',
  grow = false,
}: NodeProps) {
  const color = tone === 'neutral' ? 'neutral' : 'brand';

  if (variant === 'curvedHorizontalGray') {
    return (
      <div className="flex grow items-center">
        <div className="flex w-full items-center">
          <Circle tone="neutral" />
          <Straight direction="row" tone="neutral" />
        </div>
        <Diagonal width="w-[90px]" tone="neutral" />
      </div>
    );
  }

  if (variant === 'curvedVertical') {
    return (
      <div className={`flex flex-col ${grow ? 'grow' : ''} h-full w-[25px]`}>
        <StraightBlock direction="col" tone={color} />
        <Diagonal
          width="w-[25px]"
          translateX="translate-x-[5.1px]"
          translateY="-translate-y-[0.5px]"
          tone={color}
        />
        <Straight
          direction="col"
          translateX="-translate-x-[2.3px]"
          translateY="translate-y-[16.7px]"
          tone={color}
        />
      </div>
    );
  }

  if (variant === 'curvedHorizontalSmall') {
    return (
      <div className="flex items-center">
        <Circle tone={color} />
        <Diagonal
          width="w-[18.81px]"
          translateX="-translate-x-[1px]"
          translateY="translate-y-[3px]"
          tone={color}
        />
      </div>
    );
  }

  if (variant === 'curvedHorizontal') {
    return (
      <div className={`flex ${grow ? 'grow' : ''} w-auto items-center`}>
        <StraightBlock direction="row" tone={color} grow={true} />
        <Diagonal width="w-[90px]" tone={color} />
      </div>
    );
  }

  if (variant === 'straightDouble') {
    return (
      <div
        className={`flex flex-${direction} ${grow ? 'grow' : ''} ${
          direction === 'row' ? 'w-full h-fit' : 'w-fit h-full'
        } items-center`}
      >
        <Circle tone={color} />
        <Straight direction={direction} tone={color} />
        <Circle tone={color} />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-${direction} ${grow ? 'grow' : ''} ${
        direction === 'row' ? 'w-full h-fit' : 'w-fit h-full'
      } items-center`}
    >
      <Circle tone={color} />
      <Straight direction={direction} tone={color} />
    </div>
  );
}

/** tailwind class 그대로 쓰면 됨 */
interface DiagonalProps {
  width: string;
  translateX?: string;
  translateY?: string;
  tone: NodeTone | 'neutral';
}

/** 우하향 */
function Diagonal({
  width,
  translateX = '',
  translateY = '',
  tone,
}: DiagonalProps) {
  const borderClass =
    tone === 'neutral' ? 'border-neutral-600' : 'border-main-orange';

  return (
    <div
      className={`h-0 origin-top-left rotate-45 border-t ${borderClass} ${width} ${translateX} ${translateY}`}
    />
  );
}

/**
 * 수평선을 원하면 부모 요소 flex-direction: row
 * 수직선을 원하면 부모 요소 flex-direction: column
 */
interface StraightProps {
  direction?: 'row' | 'col';
  translateX?: string;
  translateY?: string;
  tone: NodeTone | 'neutral';
}

function Straight({
  direction = 'row',
  translateX = '',
  translateY = '',
  tone,
}: StraightProps) {
  const borderClass =
    tone === 'neutral' ? 'border-neutral-600' : 'border-main-orange';

  return (
    <div
      className={`grow ${borderClass} ${direction === 'row' ? 'border-t' : 'border-r'} ${translateX} ${translateY}`}
    />
  );
}

interface CircleProps {
  tone: NodeTone | 'neutral';
}

function Circle({ tone }: CircleProps) {
  const borderClass =
    tone === 'neutral' ? 'border-neutral-600' : 'border-main-orange';

  return <div className={`h-2.5 w-2.5 rounded-full border ${borderClass}`} />;
}

interface StraightBlockProps {
  direction: 'row' | 'col';
  tone: NodeTone;
  grow?: boolean;
}

function StraightBlock({ direction, tone, grow = false }: StraightBlockProps) {
  return (
    <div
      className={`flex flex-${direction} ${grow ? 'grow' : ''} ${
        direction === 'row' ? 'w-full h-fit' : 'w-fit h-[36px]'
      } items-center`}
    >
      <Circle tone={tone} />
      <Straight direction={direction} tone={tone} />
    </div>
  );
}

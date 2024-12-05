import MemoChecked from "@/assets/icons/Checked";
import Export from "@/assets/icons/Export";
import useAvatar from "@/hooks/useAvatar";

interface AvatarProps {
  text: string;
  className?: string;
  bg?: "primary" | "secondary";
  type?: "Normal" | "Approved" | "Exported";
}

const Avatar: React.FC<AvatarProps> = ({
  text,
  className,
  bg = "primary",
  type = "Normal",
}) => {
  const initials = useAvatar(text);

  let content: React.ReactNode;
  let bgColor: string;

  switch (type) {
    case "Normal":
      bgColor = bg === "secondary" ? "var(--primary)" : "var(--info)";
      content = (
        <div className="text-white text-[13px] font-bold">{initials}</div>
      );
      break;

    case "Approved":
      bgColor = "var(--success)";
      content = <MemoChecked className="w-[16px] h-[16px] text-white" />;
      break;

    case "Exported":
      bgColor = "var(--gray)";
      content = <Export className="w-[16px] h-[16px] text-white" />;
      break;

    default:
      bgColor = "var(--info)";
      content = (
        <div className="text-white text-[13px] font-bold	">{initials}</div>
      );
      break;
  }

  return (
    <div
      className={`w-[32px] h-[32px] text-[#FFFFFF] rounded-full mx-[4px] flex justify-center items-center ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {content}
    </div>
  );
};

export default Avatar;

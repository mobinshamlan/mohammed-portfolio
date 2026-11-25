import "./styles/base.css";
import "./styles/home.css";
import "./styles/case.css";

export default function PortfolioLayout({ children }: LayoutProps<"/">) {
  return <div className="vb">{children}</div>;
}

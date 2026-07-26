import { Component, type ErrorInfo, type ReactNode } from "react";
import "../pages/notfound.css";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

export default class SiteErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // The recovery surface intentionally avoids depending on the router.
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="notfound reading-surface">
        <div className="container notfound__inner">
          <p className="notfound__code readout readout--strong">SITE</p>
          <h1 className="notfound__title">Something went wrong</h1>
          <p className="notfound__lead">
            The page could not be displayed. Reload the site to try again.
          </p>
          <div className="notfound__links">
            <a className="btn btn--primary readout" href={import.meta.env.BASE_URL}>
              <span className="btn__label">Reload home</span>
            </a>
          </div>
        </div>
      </main>
    );
  }
}

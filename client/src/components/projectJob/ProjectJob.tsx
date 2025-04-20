import { Link } from "react-router-dom";
import "../jobCard/JobCard.scss";
import { PortfolioItem } from "../../types/Profile";

interface ProjectCardProps {
  project: PortfolioItem;
}

export const ProjectJob: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/jobs/${project._id}`} className="jobcard">
      <div className="jobcard__body">
        <div className="jobcard__titles">
          <h4 className="gigcard__title text-bold">{project.title}</h4>
          <h4 className="gigcard__price text-bold">${project.budget}</h4>
        </div>

        <div className="jobcard__desc">
          <p>{project.description}</p>
        </div>
      </div>
    </Link>
  );
};

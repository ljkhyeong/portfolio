import { Link } from "react-router-dom"
import "../../css/BatonServiceSwitcher.css"

const BatonServiceSwitcher = ({ services, currentServiceId = "core" }) => (
    <nav className="baton-service-switcher" aria-label="BATON 서비스 바로가기">
        <span>BATON 서비스</span>
        <ul>
            {services.map((service) => {
                const serviceId = service.primary ? "core" : service.id
                const isCurrent = serviceId === currentServiceId

                return (
                    <li key={serviceId}>
                        <Link
                            to={service.primary ? "/projects/baton" : service.route}
                            aria-current={isCurrent ? "page" : undefined}
                        >
                            {service.primary ? "Core" : service.name}
                        </Link>
                    </li>
                )
            })}
        </ul>
    </nav>
)

export default BatonServiceSwitcher

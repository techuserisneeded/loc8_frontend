import React from "react";

import SuperAdminLayout from "../layouts/SuperAdminLayout";
import KeyMetrics from "../components/KeyMetrics";

const KeyMetricsPage = () => {
	return (
		<SuperAdminLayout activeLink={"/key-metrics"}>
			<KeyMetrics />
		</SuperAdminLayout>
	);
};

export default KeyMetricsPage;

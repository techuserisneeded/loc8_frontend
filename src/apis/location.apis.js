import axios from "../libs/axios.lib";
import * as loginUtils from "../utils/login.utils";

export async function getZonesAPI() {
  const token = loginUtils.getUser().token;

  const { data } = await axios.get("location/zones", {
    headers: {
      Authorization: token,
    },
  });

  return data;
}

export async function getStatesAPI(zone_id) {
  const token = loginUtils.getUser().token;

  const { data } = await axios.get("location/states", {
    params: {
      zone_id: isNaN(parseInt(zone_id)) ? undefined : parseInt(zone_id),
    },
    headers: {
      Authorization: token,
    },
  });

  return data;
}

export async function getCitiesAPI(state_id) {
  const token = loginUtils.getUser().token;

  const { data } = await axios.get("location/cities", {
    params: {
      state_id: isNaN(parseInt(state_id)) ? undefined : parseInt(state_id),
    },
    headers: {
      Authorization: token,
    },
  });

  return data;
}

export async function addStatesAPI(state_name, zone_id) {
  const token = loginUtils.getUser().token;

  const { data } = await axios.post(
    "location/states",
    {
      state_name: state_name.trim().toLowerCase(),
      zone_id: zone_id.trim().toLowerCase(),
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return data;
}

export async function addCitiesAPI(city_name, state_id) {
  const token = loginUtils.getUser().token;

  const { data } = await axios.post(
    "location/cities",
    {
      city_name: city_name.trim().toLowerCase(),
      state_id: state_id.trim().toLowerCase(),
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return data;
}

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  document.getElementById("vibration").addEventListener("click", vibration);

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
}

function vibration() {

  var time = 2000;
  navigator.vibrate(time);

  //var gyro = navigator.gyroscope.getCurrentGyroscope();
  document.getElementById("test").innerHTML = "Le Text à changé";
}

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onSuccess(position) {
  var element1 = document.getElementById("showGeolocation");
  element1.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br />" +
    "Longitude: " +
    position.coords.longitude +
    "<br />";

  // Where you want to render the map.
  var element = document.getElementById('osm-map');

  // Height has to be set. You can do this in CSS too.
  element.style.height = '500px';
  element.style.width = '100%'


  // Create Leaflet map on map element.
  var map = L.map(element);
  
  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Target's GPS coordinates.
  var target = L.latLng(position.coords.latitude, position.coords.longitude);

  // Set map's center to target with zoom 14.
  map.setView(target, 14);

  // Place a marker on the same location.
  L.marker(target).addTo(map);
}

// onError Callback receives a PositionError object
//
function onError(error) {
  alert("code: " + error.code + "\n" + "message: " + error.message + "\n");
}

// Options: throw an error if no update is received every 30 seconds.
//
var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
  timeout: 30000,
});

import paraview.web.venv  # Available in PV 5.11

from trame.app import get_server
from trame.widgets import vuetify3, paraview, iframe
from trame.ui.vuetify3 import SinglePageLayout

from paraview import simple

# -----------------------------------------------------------------------------

server = get_server(client_type="vue3")
state, ctrl = server.state, server.controller
state.trame__title = "ParaView cone"

# -----------------------------------------------------------------------------
# ParaView code
# -----------------------------------------------------------------------------

DEFAULT_RESOLUTION = 6

cone = simple.Cone()
representation = simple.Show(cone)
view = simple.Render()


@state.change("resolution")
def update_cone(resolution, **kwargs):
    cone.Resolution = resolution
    ctrl.view_update()
    ctrl.post_message({ "emit": 'trame_to_react', "value": state.resolution })

    
def update_state_resolution(resolution):
    state.resolution = int(resolution)


def update_reset_resolution():
    state.resolution = DEFAULT_RESOLUTION


# -----------------------------------------------------------------------------


with SinglePageLayout(server) as layout:
    layout.icon.click = ctrl.view_reset_camera
    layout.title.set_text("Cone Application")

    with layout.toolbar:
        vuetify3.VSpacer()
        vuetify3.VSlider(
            v_model=("resolution", DEFAULT_RESOLUTION),
            min=3,
            max=60,
            step=1,
            hide_details=True,
            dense=True,
            style="max-width: 300px",
        )
        vuetify3.VDivider(vertical=True, classes="mx-2")
        with vuetify3.VBtn(icon=True, click=update_reset_resolution):
            vuetify3.VIcon("mdi-undo-variant")

    with layout.content:
        communicator = iframe.Communicator(
            event_names=["react_to_trame"],
            react_to_trame=(update_state_resolution, "[$event]"),
        )
        ctrl.post_message = communicator.post_message
        with vuetify3.VContainer(fluid=True, classes="pa-0 fill-height"):
            html_view = paraview.VtkLocalView(view, ref="view")
            ctrl.view_reset_camera = html_view.reset_camera
            ctrl.view_update = html_view.update

if __name__ == "__main__":
    server.start()
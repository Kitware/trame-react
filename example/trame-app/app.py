from trame.app import get_server
from trame.ui.vuetify3 import SinglePageLayout
from trame.widgets import iframe, vuetify3 as vuetify, vtk as vtk_widgets

from vtkmodules.vtkFiltersSources import vtkConeSource
from vtkmodules.vtkRenderingCore import (
    vtkRenderer,
    vtkRenderWindow,
    vtkRenderWindowInteractor,
    vtkPolyDataMapper,
    vtkActor,
)
from vtkmodules.vtkInteractionStyle import vtkInteractorStyleSwitch  # noqa

### Setup some VTK pipeline
renderer = vtkRenderer()
renderWindow = vtkRenderWindow()
renderWindow.AddRenderer(renderer)

renderWindowInteractor = vtkRenderWindowInteractor()
renderWindowInteractor.SetRenderWindow(renderWindow)
renderWindowInteractor.GetInteractorStyle().SetCurrentStyleToTrackballCamera()

cone_source = vtkConeSource()
mapper = vtkPolyDataMapper()
actor = vtkActor()
mapper.SetInputConnection(cone_source.GetOutputPort())
actor.SetMapper(mapper)
renderer.AddActor(actor)
renderer.ResetCamera()
renderWindow.Render()

server = get_server(client_type="vue3")
state, ctrl = server.state, server.controller
state.trame__title = "Trame React iframe example"

state.interaction_mode = "interact"
state.selection_updated = True
state.interactor_settings = []

DEFAULT_RESOLUTION = 6

VIEW_INTERACT = [
    {"button": 1, "action": "Rotate"},
    {"button": 2, "action": "Pan"},
    {"button": 3, "action": "Zoom", "scrollEnabled": True},
    {"button": 1, "action": "Pan", "alt": True},
    {"button": 1, "action": "Zoom", "control": True},
    {"button": 1, "action": "Pan", "shift": True},
    {"button": 1, "action": "Roll", "alt": True, "shift": True},
]

VIEW_SELECT = [{"button": 1, "action": "Select"}]

@state.change("interaction_mode")
def update_picking_mode(interaction_mode, **kwargs):
    print(f"state change - updating interaction mode: {interaction_mode}")

    if interaction_mode == "interact":
        state.update(
            {
                "interactor_settings": VIEW_INTERACT,
            }
        )
    else:
        state.interactor_settings = VIEW_SELECT if interaction_mode == "select" else VIEW_INTERACT

    state.flush()

@ctrl.trigger("get_number_of_cells")
def get_number_of_cells():
    cone = cone_source.GetOutput()
    return cone.GetNumberOfCells()

@ctrl.trigger("raise_error")
def raise_error():
    raise RuntimeError("I'm not doing this")

@state.change("resolution")
def update_cone(resolution, **kwargs):
    print(f"state change - updating resolution to {resolution}")

    cone_source.SetResolution(resolution)
    ctrl.view_update()



@ctrl.trigger("reset_resolution")
def reset_resolution():
    state.resolution = DEFAULT_RESOLUTION


# -----------------------------------------------------------------------------


with SinglePageLayout(server) as layout:
    layout.icon.click = ctrl.view_reset_camera
    ctrl.trigger("reset_camera")(ctrl.view_reset_camera)
    layout.title.set_text("Trame Iframe - Cone Application")

    with layout.toolbar:
        vuetify.VSpacer()
        vuetify.VSlider(
            v_model=("resolution", DEFAULT_RESOLUTION),
            min=3,
            max=60,
            step=1,
            hide_details=True,
            dense=True,
            style="max-width: 300px",
        )
        vuetify.VDivider(vertical=True, classes="mx-2")

        with vuetify.VBtn(icon=True, click=reset_resolution):
            vuetify.VIcon("mdi-undo-variant")

    with layout.content:
        iframe.Communicator(target_origin="http://localhost:3000", enable_rpc=True)

        html_view = vtk_widgets.VtkLocalView(
            renderWindow,
            interactor_settings=("interactor_settings",)
        )
        ctrl.view_reset_camera = html_view.reset_camera
        ctrl.view_update = html_view.update

if __name__ == "__main__":
    server.start()

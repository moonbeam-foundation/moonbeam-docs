import pytest


@pytest.fixture
def owner(accounts):
    return accounts[0]


@pytest.fixture
def box(owner, project):
    return owner.deploy(project.Box)

# features/tasks.feature
Feature: Adding tasks

  Scenario: Adding the first task
    Given there are no tasks
    When I add the task "buy chocolate"
    Then the list of tasks should be
      | buy chocolate |

  Scenario: Adding a second task
    Given the list of tasks is
      | buy chocolate |
    When I add the task "clean up"
    Then the system should ask me which one is more important
      | buy chocolate |
      | clean up      |

  Scenario: Setting importance
    Given the list of tasks is
      | buy chocolate |
    And the system is asking me which one is more important
      | buy chocolate |
      | clean up      |
    When I answer "buy chocolate"
    Then the system sould ask which one is more urgent
      | buy chocolate |
      | clean up      |


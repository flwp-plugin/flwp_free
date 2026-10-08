<?php

namespace FLWP\Helper;

class ConfigHelper {

    protected int $tmpElementIdNumber = 1;

    public function get_field_types_config() {
        return [
            'headline' => [
                'name' => esc_html__('fields.headline.name', 'flwp'),
                'icon' => 'fa-heading',
                'defaultLabel' => esc_html__('fields.headline.default_label', 'flwp'),
                'supportedSettings' => ['label', 'hType', 'fontSize', 'lineHeight', 'customColors', 'alignment', 'textFormatting', 'icon', 'iconPosition'],
                'customColorTypes' => ['textColor'],
                'userinput' => false,
                'baseHeight' => 25
            ],
            'description' => [
                'name' => esc_html__('fields.description.name', 'flwp'),
                'icon' => 'fa-align-left',
                'defaultLabel' => esc_html__('fields.description.default_label', 'flwp'),
                'supportedSettings' => ['label', 'fontSize', 'lineHeight', 'customColors', 'alignment', 'textFormatting', 'width', 'clearBefore'],
                'customColorTypes' => ['textColor'],
                'userinput' => false,
                'baseHeight' => 18
            ],
            'button' => [
                'name' => esc_html__('fields.button.name', 'flwp'),
                'icon' => 'fa-square-minus',
                'defaultLabel' => esc_html__('fields.button.default_label', 'flwp'),
                'supportedSettings' => ['label', 'buttonType', 'alignment', 'icon', 'iconPosition', 'fontSize', 'lineHeight', 'borderRadius', 'customColors', 'step2Enabled', 'fullWidth', 'width', 'clearBefore'],
                'customColorTypes' => ['bgColor', 'textColor', 'borderColor', 'hoverBgColor', 'hoverTextColor', 'hoverBorderColor'],
                'userinput' => true,
                'baseHeight' => 48
            ],
            'textarea' => [
                'name' => esc_html__('fields.textarea.name', 'flwp'),
                'icon' => 'fa-keyboard',
                'defaultLabel' => esc_html__('fields.textarea.default_label', 'flwp'),
                'supportedSettings' => ['label', 'hideLabel', 'placeholder', 'required', 'fontSize', 'lineHeight', 'width', 'clearBefore'],
                'userinput' => true,
                'baseHeight' => 150,
                'labelHeight' => 18,
            ],
            'rating' => [
                'name' => esc_html__('fields.rating.name', 'flwp'),
                'icon' => 'fa-star',
                'defaultLabel' => esc_html__('fields.rating.default_label', 'flwp'),
                'supportedSettings' => ['label', 'hideLabel', 'stars', 'required', 'alignment', 'customColors', 'step2Enabled'],
                'customColorTypes' => ['textColor', 'hoverTextColor'],
                'userinput' => true,
                'baseHeight' => 30,
                'labelHeight' => 18
            ],
            'thumbs' => [
                'name' => esc_html__('fields.thumbs.name', 'flwp'),
                'icon' => 'fa-thumbs-up',
                'defaultLabel' => esc_html__('fields.thumbs.default_label', 'flwp'),
                'supportedSettings' => ['label', 'hideLabel', 'required', 'alignment', 'customColors', 'step2Enabled'],
                'customColorTypes' => ['bgColor', 'textColor', 'borderColor', 'hoverBgColor', 'hoverTextColor', 'hoverBorderColor'],
                'userinput' => true,
                'baseHeight' => 38,
                'labelHeight' => 24,
                'isPro' => true
            ],
            'smileys' => [
                'name' => esc_html__('fields.smileys.name', 'flwp'),
                'icon' => 'fa-smile',
                'defaultLabel' => esc_html__('fields.smileys.default_label', 'flwp'),
                'supportedSettings' => ['label', 'hideLabel', 'required', 'alignment', 'smileyLegend', 'customColors', 'step2Enabled'],
                'customColorTypes' => ['textColor', 'hoverTextColor'],
                'userinput' => true,
                'baseHeight' => 34,
                'labelHeight' => 18,
                'legendHeight' => 34,
                'isPro' => true
            ],
            'nps' => [
                'name' => esc_html__('fields.nps.name', 'flwp'),
                'icon' => 'fa-chart-bar',
                'defaultLabel' => esc_html__('fields.nps.default_label', 'flwp'),
                'supportedSettings' => ['label', 'hideLabel', 'required', 'alignment', 'customColors', 'step2Enabled'],
                'customColorTypes' => ['bgColor', 'textColor', 'borderColor', 'hoverBgColor', 'hoverTextColor', 'hoverBorderColor'],
                'userinput' => true,
                'baseHeight' => 28,
                'labelHeight' => 18,
                'isPro' => true
            ],
        ];
    }

    public function create_field_definition($type, $overrides = []) {
        $field_configs = self::get_field_types_config();
        if (!isset($field_configs[$type])) {
            return null;
        }

        $config = $field_configs[$type];
        $timestamp = (int)(microtime(true) * 1000) + $this->tmpElementIdNumber;

        $elementId = 'flwp-el-' . $timestamp;

        $definition = [
            'id' => $elementId,
            'type' => $type,
            'label' => $overrides['label'] ?? $config['defaultLabel'],
            'settings' => $overrides['settings'] ?? []
        ];

        $this->tmpElementIdNumber++;

        return $definition;
    }

    public function get_default_form_config(string $formStepDataType = 'default') {
        $adminEmail = get_option('admin_email', esc_html__('admin.config.default_email', 'flwp'));
        $homeUrl = get_option('home');

        $formStepData = $this->generate_form_step_data($formStepDataType);

        return [
            'status' => 1,
            'settings' => [
				'main' => [
					'title'         => esc_html__('admin.db.default_form_name', 'flwp'),
		            'customClasses' => '',
		            'honeypot'      => true,
				],
				'styles' => [
					'accentColor' => '#000000',
					'secondaryColor' => '#555555',
				],
                'display' => [
					'displayType' => 'in-content',
					'displaySubType' => 'shortcode',
					'subTypeData' => [
						'shortcode' => [
							'autoEnabled' => false,
							'autoPosition' => 'bottom',
							'globalData' => [
								'main' => [
									'cookieSubmitDays' => 30,
									'cookieScope' => 'domain',
								],
								'spacing' => [
									'padding' => [ 'top' => '16', 'right' => '16', 'bottom' => '16', 'left' => '16', 'unit' => 'px'],
									'margin' => [ 'top' => '0', 'right' => 'auto', 'bottom' => '0', 'left' => 'auto', 'unit' => 'px'],
									'position' => 'center',
								],
								'design' => [
									'customStylesEnabled' => false,
									'bgColor' => '#ffffff',
									'borderColor' => '#ffffff',
								],
							]
						],
						'modal' => [
							'trigger' => 'click',
							'triggerData' => [
								'exitIntent' => [
									'delay' => '5s'
								],
								'scroll' => [
									'type' => 'end',
									'percent' => 50
								],
								'click' => [
									'selector' => ''
								],
							],
							'globalData' => [
								'main' => [
									'cookieCloseDays' => 1,
									'cookieSubmitDays' => 30,
									'cookieScope' => 'domain',
									'showBackdrop' =>  true,
									'allowBodyScroll' => true,
									'closeOnBackdrop' => true,
									'closeOnEsc' => true,
									'hideHeader' => false,
									'hideFooter' => false,
								],
								'spacing' => [
									'position' => 'center',
								],
								'design' => [
									'headerIndicator' => 'progress',
									'showFooterText' => true,
									'customFooterText' => esc_html__('admin.frontend.default_footer_text', 'flwp'),
								],
							]
						],
						'slide-in' => [
							'trigger' => 'click',
							'triggerData' => [
								'exitIntent' => [
									'delay' => '5s'
								],
								'scroll' => [
									'type' => 'end',
									'percent' => 50
								],
								'click' => [
									'selector' => ''
								],
							],
							'globalData' => [
								'main' => [
									'cookieCloseDays' => 1,
									'cookieSubmitDays' => 30,
									'cookieScope' => 'domain',
									'showBackdrop' =>  false,
									'allowBodyScroll' => true,
									'closeOnBackdrop' => true,
									'closeOnEsc' => true,
									'hideHeader' => false,
									'hideFooter' => false,
								],
								'spacing' => [
									'position' => 'bottom-right',
								],
								'design' => [
									'headerIndicator' => 'progress',
									'showFooterText' => true,
									'customFooterText' => esc_html__('admin.frontend.default_footer_text', 'flwp'),
								],
							]
						],
						'feedback-button' => [
							'text' => 'FEEDBACK',
							'position' => 'right-middle',
							'customStylesEnabled' => false,
							'hideOptionEnabled' => true,
							'bgColor' => '#ffffff',
							'textColor' => '#104689',
							'borderColor' => '#104689',
							'hoverBgColor' => '#104689',
							'hoverTextColor' => "#ffffff",
							'hoverBorderColor' => "#104689",
							'fontSize' => 16,
							'globalData' => [
								'main' => [
									'cookieCloseDays' => 0,
									'cookieSubmitDays' => 30,
									'cookieScope' => 'domain',
									'showBackdrop' =>  false,
									'allowBodyScroll' => true,
									'closeOnBackdrop' => true,
									'closeOnEsc' => true,
									'hideHeader' => false,
									'hideFooter' => false,
								],
								'spacing' => [
									'position' => 'bottom-right',
								],
								'design' => [
									'headerIndicator' => 'progress',
									'showFooterText' => true,
									'customFooterText' => esc_html__('admin.frontend.default_footer_text', 'flwp'),
								],
							]
						],
					],
                ],
                'tracking' => [
                    'enabled' => true,
                    'url' => true,
                    'pageTitle' => true,
                    'referrer' => true,
                    'userAgent' => true,
                    'language' => false,
                    'screenResolution' => false,
                    'viewportSize' => false,
                    'timezone' => false,
                    'connectionType' => false,
                    'deviceType' => false,
                    'anonymizedSessionId' => false,
                    'timeOnPageSeconds' => false,
                    'colorScheme' => false
                ]
            ],
            'confirmation' => [
                'type' => 'message',
                'message' => wp_kses(__('confirmation.message.default', 'flwp'), array('p' => array())), // tinymce
                'extUrl' => $homeUrl
            ],
            'notification' => [
                'enabled' => true,
                'recipient' => $adminEmail,
                'subject' => esc_html__('notification.subject.default', 'flwp'),
                'senderName' => get_bloginfo('name') . ' - FLWP Plugin',
                'senderEmail' => $adminEmail,
            ],
            'targeting' => [
                'in-content' => [
                    'singleRules' => [
                        'show_on_frontpage' => false
                    ],
                    'andRules' => [
                        [
                            'id' => 'rule-0nf1on5n8',
                            'type' => 'page_type',
                            'operator' => 'in',
                            'value' => [
                                'page',
                                'post'
                            ]
                        ],
                        [
                            'id' => 'rule-pb0rbr8ut',
                            'type' => 'device',
                            'operator' => 'in',
                            'value' => [
                                'desktop',
                                'mobile'
                            ]
                        ]
                    ],
                    'orRules' => []
                ],
                'shortcode' => [
                    'singleRules' => [
                        'show_on_frontpage' => false
                    ],
                    'andRules' => [
                        [
                            'id' => 'rule-w54u4zty8',
                            'type' => 'page_type',
                            'operator' => 'in',
                            'value' => [
                                'page',
                                'post'
                            ]
                        ],
                        [
                            'id' => 'rule-jjm9ltql1',
                            'type' => 'device',
                            'operator' => 'in',
                            'value' => [
                                'desktop',
                                'mobile'
                            ]
                        ]
                    ],
                    'orRules' => []
                ],
                'overlay' => [
                    'singleRules' => [
                        'show_on_frontpage' => false
                    ],
                    'andRules' => [
                        [
                            'id' => 'rule-th8uhc2ef',
                            'type' => 'page_type',
                            'operator' => 'in',
                            'value' => [
                                'page',
                                'post'
                            ]
                        ],
                        [
                            'id' => 'rule-z59f0j9o3',
                            'type' => 'device',
                            'operator' => 'in',
                            'value' => [
                                'desktop',
                                'mobile'
                            ]
                        ]
                    ],
                    'orRules' => []
                ]
            ],
            'steps' => $formStepData['steps'],
            'activeStep2TriggerId' => $formStepData['activeStep2TriggerId']
        ];
    }


    public function get_form_templates() {

        return [
            'bug' => [
                'title' => esc_html__('admin.form_template.bug.title', 'flwp'),
                'steps' => $this->generate_form_step_data('template-2')['steps'] ?? []
            ],
            'website' => [
                'title' => esc_html__('admin.form_template.website.title', 'flwp'),
                'steps' => $this->generate_form_step_data('template-3')['steps'] ?? []
            ],
            'template-4' => [
                'title' => esc_html__('admin.form_template.template-4.title', 'flwp'),
                'steps' => $this->generate_form_step_data('template-4')['steps'] ?? []
            ],
            'nps' => [
                'title' => esc_html__('admin.form_template.nps.title', 'flwp'),
                'steps' => $this->generate_form_step_data('template-1')['steps'] ?? []
            ],
            'article-feedback' => [
				'title' => esc_html__('admin.initial_form.in_content.title', 'flwp'),
	            'steps' => $this->generate_form_step_data('default')['steps'] ?? []
			],
            'feedback-button' => [
				'title' => esc_html__('admin.initial_form.feedback_button.title', 'flwp'),
	            'steps' => $this->generate_form_step_data('feedback-button')['steps'] ?? []
			],
            'exit-intent' => [
				'title' => esc_html__('admin.initial_form.exit_intent.title', 'flwp'),
	            'steps' => $this->generate_form_step_data('exit-intent')['steps'] ?? []
			],
            'blank' => [
                'title' => esc_html__('admin.form_template.blank.title', 'flwp'),
                'steps' => ['step1' => [], 'step2' => []]
            ]
        ];
    }

    /**
     * Generiert die formstep daten anhand des übergebenen typs
     *
     * @return array Die Anfangsdaten für das Formular.
     */
    private function generate_form_step_data(string $type = 'default'): array
    {
        $formStepData = [];

        switch ($type) {
            case 'default':
                $ratingField = $this->create_field_definition('rating', [
                    'label' => esc_html__('admin.default.rating.label', 'flwp'),
                    'settings' => ['stars' => 5, 'alignment' => 'center','required' => true, 'step2Enabled' => true, 'hideLabel' => true]
                ]);

                $formStepData = [
                    'steps' => [
                        'step1' => [
                            $this->create_field_definition('headline', ['label' => esc_html__('admin.default.step1.headline.label', 'flwp'), 'settings' => ['alignment' => 'center']]),
                            $this->create_field_definition('description', ['label' => esc_html__('admin.default.step1.description.label', 'flwp'), 'settings' => ['alignment' => 'center']]),
                            $ratingField
                        ],
                        'step2' => [
                            $ratingField['id'] => [
                                $this->create_field_definition('headline', ['label' => esc_html__('admin.default.step2.headline.label', 'flwp'), 'settings' => ['alignment' => 'center']]),
                                $this->create_field_definition('description', ['label' => esc_html__('admin.default.step2.description.label', 'flwp'), 'settings' => ['alignment' => 'center']]),
                                $this->create_field_definition('textarea', ['label' => esc_html__('admin.default.step2.textarea.label', 'flwp'), 'settings' => ['placeholder' => esc_html__('admin.default.step2.textarea.placeholder', 'flwp'), 'required' => false, 'hideLabel' => true]]),
                                $this->create_field_definition('button', ['label' => esc_html__('admin.default.step2.button.back.label', 'flwp'), 'settings' => ['icon' => 'fa-times', 'buttonType' => 'back', 'width' => '50%', 'fullWidth' => false, 'alignment' => 'right']]),
                                $this->create_field_definition('button', ['label' => esc_html__('admin.default.step2.button.submit.label', 'flwp'), 'settings' => ['icon' => 'fa-times', 'buttonType' => 'submit', 'width' => '50%', 'fullWidth' => false, 'alignment' => 'left']])
                            ]
                        ]
                    ],
                    'activeStep2TriggerId' => $ratingField['id']
                ];

                break;
            case 'feedback-button':
                $btnImprove = $this->create_field_definition('button', [
                    'label' => esc_html__('admin.feedback_button.btn_improve.label', 'flwp'),
                    'settings' => [
                        'icon' => 'fa-laugh-beam',
                        'step2Enabled' => true,
                        'buttonType' => 'next',
                        'iconPosition' => 'left',
                        'alignment' => 'left',
                        'customColorsEnabled' => true,
                        'bgColor' => '#ffffff',
                        'textColor' => '#000000',
                        'borderColor' => '#dddddd',
                        'hoverBgColor' => '#d2ddea',
                        'hoverBorderColor' => '#104689',
                    ]
                ]);

                $btnMissing = $this->create_field_definition('button', [
                    'label' => esc_html__('admin.feedback_button.btn_missing.label', 'flwp'),
                    'settings' => [
                        'icon' => 'fa-puzzle-piece',
                        'step2Enabled' => true,
                        'buttonType' => 'next',
                        'iconPosition' => 'left',
                        'alignment' => 'left',
                        'customColorsEnabled' => true,
                        'bgColor' => '#ffffff',
                        'textColor' => '#000000',
                        'borderColor' => '#dddddd',
                        'hoverBorderColor' => '#104689',
                        'hoverBgColor' => '#d2ddea'
                    ]
                ]);

                $btnIdea = $this->create_field_definition('button', [
                    'label' => esc_html__('admin.feedback_button.btn_idea.label', 'flwp'),
                    'settings' => [
                        'icon' => 'fa-lightbulb',
                        'step2Enabled' => true,
                        'buttonType' => 'next',
                        'iconPosition' => 'left',
                        'alignment' => 'left',
                        'customColorsEnabled' => true,
                        'bgColor' => '#ffffff',
                        'textColor' => '#000000',
                        'borderColor' => '#dddddd',
                        'hoverBorderColor' => '#104689',
                        'hoverBgColor' => '#d2ddea'
                    ]
                ]);

                $btnProblem = $this->create_field_definition('button', [
                    'label' => esc_html__('admin.feedback_button.btn_problem.label', 'flwp'),
                    'settings' => [
                        'icon' => 'fa-bug',
                        'step2Enabled' => true,
                        'buttonType' => 'next',
                        'iconPosition' => 'left',
                        'alignment' => 'left',
                        'customColorsEnabled' => true,
                        'bgColor' => '#ffffff',
                        'textColor' => '#000000',
                        'borderColor' => '#dddddd',
                        'hoverBorderColor' => '#104689',
                        'hoverBgColor' => '#d2ddea'
                    ]
                ]);

                $btnOther = $this->create_field_definition('button', [
                    'label' => esc_html__('admin.feedback_button.btn_other.label', 'flwp'),
                    'settings' => [
                        'icon' => 'fa-comment-dots',
                        'step2Enabled' => true,
                        'buttonType' => 'next',
                        'iconPosition' => 'left',
                        'alignment' => 'left',
                        'customColorsEnabled' => true,
                        'bgColor' => '#ffffff',
                        'textColor' => '#000000',
                        'borderColor' => '#dddddd',
                        'hoverBorderColor' => '#104689',
                        'hoverBgColor' => '#d2ddea'
                    ]
                ]);

                $formStepData = [
                    'steps' => [
                        'step1' => [
                            $this->create_field_definition('headline', ['label' => esc_html__('admin.feedback_button.step1.headline.label', 'flwp')]),
                            $btnImprove,
                            $btnMissing,
                            $btnIdea,
                            $btnProblem,
                            $btnOther
                        ],
                        'step2' => [
                            $btnImprove['id'] => [
                                $this->create_field_definition('headline', ['label' => esc_html__('admin.feedback_button.step2.improve.headline.label', 'flwp'), 'settings' => ['alignment' => 'center', 'hideLabel' => false, 'icon' => 'fa-times']]),
                                $this->create_field_definition('rating', ['label' => esc_html__('admin.default.rating.label', 'flwp'), 'settings' => ['stars' => 5, 'required' => true, 'alignment' => 'center', 'step2Enabled' => false, 'hideLabel' => true]])
                            ],
                            $btnMissing['id'] => [
                                $this->create_field_definition('headline', ['label' => esc_html__('admin.feedback_button.step2.missing.headline.label', 'flwp'), 'settings' => ['fontSize' => 'inherit', 'alignment' => 'center', 'hideLabel' => false, 'icon' => 'fa-puzzle-piece']]),
                                $this->create_field_definition('description', ['label' => esc_html__('admin.feedback_button.step2.missing.description.label', 'flwp'), 'settings' => ['alignment' => 'center', 'fontSize' => 'inherit', 'hideLabel' => false]]),
                                $this->create_field_definition('textarea', ['label' => esc_html__('admin.feedback_button.step2.missing.textarea.label', 'flwp'), 'settings' => ['placeholder' => esc_html__('admin.feedback_button.step2.missing.textarea.placeholder', 'flwp'), 'required' => true, 'fontSize' => 'inherit', 'hideLabel' => true]]),
                                $this->create_field_definition('button', ['label' => esc_html__('admin.feedback_button.step2.missing.button.label', 'flwp'), 'settings' => ['icon' => 'fa-times', 'buttonType' => 'submit', 'fontSize' => 'inherit', 'hideLabel' => false, 'alignment' => 'center', 'customColorsEnabled' => false]])
                            ],
                            $btnIdea['id'] => [
                                $this->create_field_definition('headline', ['label' => esc_html__('admin.feedback_button.step2.idea.headline.label', 'flwp'), 'settings' => ['fontSize' => 'inherit', 'alignment' => 'center', 'hideLabel' => false, 'icon' => 'fa-lightbulb']]),
                                $this->create_field_definition('description', ['label' => esc_html__('admin.feedback_button.step2.idea.description.label', 'flwp'), 'settings' => ['alignment' => 'center', 'fontSize' => 'inherit', 'hideLabel' => false]]),
                                $this->create_field_definition('textarea', ['label' => esc_html__('admin.feedback_button.step2.idea.textarea.label', 'flwp'), 'settings' => ['placeholder' => esc_html__('admin.feedback_button.step2.idea.textarea.placeholder', 'flwp'), 'required' => true, 'fontSize' => 'inherit', 'hideLabel' => true]]),
                                $this->create_field_definition('button', ['label' => esc_html__('admin.feedback_button.step2.idea.button.label', 'flwp'), 'settings' => ['icon' => 'fa-times', 'buttonType' => 'submit', 'fontSize' => 'inherit', 'hideLabel' => false, 'alignment' => 'center']])
                            ],
                            $btnProblem['id'] => [
                                $this->create_field_definition('headline', ['label' => esc_html__('admin.feedback_button.step2.problem.headline.label', 'flwp'), 'settings' => ['fontSize' => 'inherit', 'alignment' => 'center', 'hideLabel' => false, 'icon' => 'fa-bug']]),
                                $this->create_field_definition('description', ['label' => esc_html__('admin.feedback_button.step2.problem.description.label', 'flwp'), 'settings' => ['alignment' => 'center', 'fontSize' => 'inherit', 'hideLabel' => false]]),
                                $this->create_field_definition('textarea', ['label' => esc_html__('admin.feedback_button.step2.problem.textarea.label', 'flwp'), 'settings' => ['placeholder' => esc_html__('admin.feedback_button.step2.problem.textarea.placeholder', 'flwp'), 'required' => true, 'fontSize' => 'inherit', 'hideLabel' => true]]),
                                $this->create_field_definition('button', ['label' => esc_html__('admin.feedback_button.step2.problem.button.label', 'flwp'), 'settings' => ['icon' => 'fa-times', 'buttonType' => 'submit', 'fontSize' => 'inherit', 'hideLabel' => false, 'alignment' => 'center']])
                            ],
                            $btnOther['id'] => [
                                $this->create_field_definition('headline', ['label' => esc_html__('admin.feedback_button.step2.other.headline.label', 'flwp'), 'settings' => ['fontSize' => 'inherit', 'alignment' => 'center', 'hideLabel' => false, 'icon' => 'fa-comment-dots']]),
                                $this->create_field_definition('description', ['label' => esc_html__('admin.feedback_button.step2.other.description.label', 'flwp'), 'settings' => ['alignment' => 'center', 'fontSize' => 'inherit', 'hideLabel' => false]]),
                                $this->create_field_definition('textarea', ['label' => esc_html__('admin.feedback_button.step2.other.textarea.label', 'flwp'), 'settings' => ['placeholder' => esc_html__('admin.feedback_button.step2.other.textarea.placeholder', 'flwp'), 'required' => true, 'fontSize' => 'inherit', 'hideLabel' => true]]),
                                $this->create_field_definition('button', ['label' => esc_html__('admin.feedback_button.step2.other.button.label', 'flwp'), 'settings' => ['icon' => 'fa-times', 'buttonType' => 'submit', 'fontSize' => 'inherit', 'hideLabel' => false, 'alignment' => 'center']])
                            ],
                        ]
                    ],
                    'activeStep2TriggerId' => $btnImprove['id']
                ];
                break;
            case 'exit-intent':
                $ratingField = $this->create_field_definition('rating', [
                    'label' => esc_html__('admin.exit_intent.rating.label', 'flwp'),
                    'settings' => [
                        'stars' => 5,
                        'required' => true,
                        'step2Enabled' => true,
                        'hideLabel' => true,
                        'alignment' => 'center',
                        'customColorsEnabled' => false
                    ]
                ]);

                $formStepData = [
                    'steps' => [
                        'step1' => [
                            $this->create_field_definition('headline', [
                                'label' => esc_html__('admin.exit_intent.headline.label', 'flwp'),
                                'settings' => [
                                    'fontSize' => 'inherit',
                                    'alignment' => 'center'
                                ]
                            ]),
                            $this->create_field_definition('description', [
                                'label' => esc_html__('admin.exit_intent.description.label', 'flwp'),
                                'settings' => [
                                    'fontSize' => 'inherit',
                                    'alignment' => 'center'
                                ]
                            ]),
                            $ratingField
                        ],
                        'step2' => [
                            $ratingField['id'] => [
                                $this->create_field_definition('headline', [
                                    'label' => esc_html__('admin.exit_intent.step2.headline.label', 'flwp'),
                                    'settings' => [
                                        'fontSize' => 'inherit'
                                    ]
                                ]),
                                $this->create_field_definition('textarea', [
                                    'label' => esc_html__('admin.exit_intent.step2.textarea.label', 'flwp'),
                                    'settings' => [
                                        'placeholder' => esc_html__('admin.exit_intent.step2.textarea.placeholder', 'flwp'),
                                        'required' => false,
                                        'fontSize' => 'inherit'
                                    ]
                                ]),
                                $this->create_field_definition('button', [
                                    'label' => esc_html__('admin.exit_intent.step2.button.label', 'flwp'),
                                    'settings' => [
                                        'icon' => 'fa-times',
                                        'buttonType' => 'submit',
                                        'fontSize' => 'inherit',
                                        'fullWidth' => true,
                                        'alignment' => 'center'
                                    ]
                                ])
                            ]
                        ]
                    ],
                    'activeStep2TriggerId' => $ratingField['id']
                ];
                break;
            case 'template-1':
                $npsRating = $this->create_field_definition('nps',
                     [
                         'label'    => esc_html__('admin.template1.nps.label', 'flwp'),
                         'settings' => [
                             'stars'        => 10,
                             'required'     => true,
                             'step2Enabled' => true,
                             'hideLabel' => true,
                             'alignment' => 'center',
                             'customColorsEnabled' => false
                         ]
                     ]
                );

                $formStepData = [
                    'steps' => [
                        'step1' => [
                            $this->create_field_definition('headline', ['label' => esc_html__('admin.template1.headline.label', 'flwp'), 'settings' => ['fontSize' => '13px', 'alignment' => 'left', 'bold' => true]]),
                            $npsRating
                        ],
                        'step2' => [
                            $npsRating['id'] => [
                                $this->create_field_definition('headline', ['label' => esc_html__('admin.template1.step2.headline.label', 'flwp'), 'settings' => ['fontSize' => '18px']]),
                                $this->create_field_definition('textarea', ['label' => esc_html__('admin.template1.step2.textarea.label', 'flwp'), 'settings' => ['placeholder' => esc_html__('admin.template1.step2.textarea.placeholder', 'flwp'), 'required' => true, 'fontSize' => 'inherit']]),
                                $this->create_field_definition('button', ['label' => esc_html__('admin.template1.step2.button.label', 'flwp'), 'settings' => ['icon' => 'fa-paper-plane', 'buttonType' => 'submit', 'fontSize' => 'inherit']])
                            ]
                        ]
                    ],
                    'activeStep2TriggerId' => $npsRating['id']
                ];

                break;
            case 'template-2':
                $formStepData = [
                    'steps' => [
                        'step1' => [
                            $this->create_field_definition('headline', ['label' => esc_html__('admin.template2.headline.label', 'flwp'), 'settings' => ['fontSize' => '22px']]),
                            $this->create_field_definition('description', ['label' => esc_html__('admin.template2.description.label', 'flwp'), 'settings' => ['fontSize' => '12px']]),
                            $this->create_field_definition('textarea', ['label' => esc_html__('admin.template2.textarea.label', 'flwp'), 'settings' => ['placeholder' => esc_html__('admin.template2.textarea.placeholder', 'flwp'), 'required' => true, 'hideLabel' => true, 'fontSize' => 'inherit']]),
                            $this->create_field_definition('button', ['label' => esc_html__('admin.template2.button.label', 'flwp'), 'settings' => ['icon' => 'fa-bug', 'buttonType' => 'submit', 'fontSize' => 'inherit', 'alignment' => 'center']])
                        ],
                        'step2' => []
                    ]
                ];
                break;
            case 'template-3':
                $ratingField = $this->create_field_definition('rating',
                     [
                         'label'    => esc_html__('admin.template3.rating.label', 'flwp'),
                         'settings' => [
                             'stars'        => 5,
                             'required'     => true,
                             'step2Enabled' => true,
                             'hideLabel' => true,
                             'alignment' => 'center',
                             'customColorsEnabled' => false
                         ]
                     ]
                );

                 $formStepData = [
                     'steps' => [
                         'step1' => [
                             $this->create_field_definition('headline', ['label' => esc_html__('admin.template3.step1.headline.label', 'flwp'), 'settings' => ['alignment' => 'center']]),
                             $ratingField
                         ],
                         'step2' => [
                             $ratingField['id'] => [
                                 $this->create_field_definition('headline', ['label' => esc_html__('admin.template3.step2.headline.label', 'flwp'), 'settings' => ['alignment' => 'center']]),
                                 $this->create_field_definition('textarea', ['label' => esc_html__('admin.template3.step2.textarea.label', 'flwp'), 'settings' => ['alignment' => 'center', 'placeholder' => esc_html__('admin.template3.step2.textarea.placeholder', 'flwp'), 'hideLabel' => true, 'required' => false, 'fontSize' => 'inherit']]),
                                 $this->create_field_definition('button', ['label' => esc_html__('admin.template3.step2.button.label', 'flwp'), 'settings' => ['icon' => 'fa-check', 'buttonType' => 'submit', 'alignment' => 'center', 'fontSize' => 'inherit']])
                             ]
                         ]
                     ],
                    'activeStep2TriggerId' => $ratingField['id']
                ];
                break;
            case 'template-4':
                $ratingField = $this->create_field_definition('rating',
                      [
                          'label'    => esc_html__('admin.template4.rating.label', 'flwp'),
                          'settings' => [
                              'stars'        => 5,
                              'required'     => true,
                              'step2Enabled' => false,
                              'hideLabel' => true,
                              'alignment' => 'center',
                              'customColorsEnabled' => false
                          ]
                      ]
                );

                $formStepData = [
                    'steps' => [
                        'step1' => [
                            $this->create_field_definition('headline', ['label' => esc_html__('admin.template4.step1.headline.label', 'flwp'), 'settings' => ['alignment' => 'center']]),
                            $ratingField
                        ],
                        'step2' => []
                    ],
                    'activeStep2TriggerId' => $ratingField['id']
                ];
                break;
        }

        return $formStepData;
    }
}
